import "./SessionTableController.css"
import {DateTime} from "luxon";
import {keepPreviousData, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {DAYS_IN_WEEK, SESSION_TABLE_ROWS, UNHANDLED_ERROR_MESSAGE} from "../../../config/constants.tsx";
import sessionService from "../../../services/SessionService.ts";
import {SessionMap} from "./SessionTableController.tsx";
import {useState} from "react";
import {Button, CircularProgress} from "@mui/material";
import SessionTableWeekController from "./SessionTableTimeController.tsx";
import SessionCreateEditDto from "../../../interfaces/session/SessionCreateEditDto.ts";
import {toast} from "react-toastify";
import {AxiosError} from "axios";
import SessionReadDto from "../../../interfaces/session/SessionReadDto.ts";
import AdminSessionTableColumn from "../SessionTable/AdminSessionTableColumn.tsx";
import SessionCreateEditForm from "./SessionCreateEditForm.tsx";
import SessionMapCreate from "../../../interfaces/session/SessionMapCreate.ts";

const AdminSessionTableController = ({fieldId}: { fieldId: number }) => {

    const [openEditForm, setOpenEditForm] = useState<boolean>(false);
    const [openCreateForm, setOpenCreateForm] = useState<boolean>(false);
    const [editSession, setEditSession] = useState<SessionReadDto | undefined>(undefined);
    const [startTime, setStartTime] = useState<DateTime>
    (
        DateTime.now().startOf('day')
    );

    const {
        data: sessions = [],
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetSessions(fieldId, startTime);

    const onEdit = (session: SessionReadDto) => {
        setEditSession(session);
        setOpenEditForm(true);
    }

    const onCreateForm = async (session: SessionCreateEditDto) => {
        try {
            await createSessions({week: sessions, session: session, startTime: startTime});
            toast.success("Неделя была успешно заполнена");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }

    const onEditForm = async (session: SessionCreateEditDto) => {
        try {
            await updateSession(session);
            toast.success("Сеанс был успешно изменен");
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status == 409) {
                    toast.error("Невозможно изменить сеанс, так как он уже занят");
                    return;
                }
            }
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }

    const onDelete = async (sessionId: number) => {
        try {
            await deleteSession(sessionId);
            toast.success("Сеанс был успешно удален");
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status == 409) {
                    toast.error("Невозможно удалить сеанс, так как он уже занят");
                    return;
                }
            }
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }

    const {mutateAsync: updateSession, isPending: isUpdatePending} = useUpdateSession();
    const {mutateAsync: createSessions, isPending: isCreatePending} = useCreateSessions();
    const {mutateAsync: deleteSession, isPending: isDeletePending} = useDeleteSession();

    return <>
        <div className="session-table-controller-container">
            <div className="session-table-header-container">
                <div className="session-table-header">
                    <span className="session-select-label">Сеансы</span>
                    <Button variant="contained"
                            className="fill-week-button"
                            onClick={() => setOpenCreateForm(true)}
                            disabled={isLoading || isFetching || isUpdatePending || isDeletePending || isCreatePending}
                    >
                        Заполнить неделю
                    </Button>
                </div>
                {isLoading || isFetching || isUpdatePending || isDeletePending || isCreatePending ?
                    <CircularProgress/> : ''}
                <SessionTableWeekController startTime={startTime} setStartTime={setStartTime}/>
                {isLoadingError ? <span className="text-red-600">{UNHANDLED_ERROR_MESSAGE}</span> : ''}
            </div>
            <div className="session-table-container">
                <div className="session-table-hours-column">
                    {Array.from({length: SESSION_TABLE_ROWS}, (_, hour) => (
                        <div key={hour} className="session-table-left-hour-container">
                            {startTime.plus({hours: hour}).setLocale("ru").toFormat('HH:mm')}
                        </div>
                    ))}
                </div>
                {Array.from({length: DAYS_IN_WEEK}, (_, day) => (
                    <AdminSessionTableColumn key={day}
                                             sessions={sessions[day]}
                                             onEdit={onEdit}
                                             onDelete={onDelete}
                    />
                ))}
                <div className="session-table-hours-column">
                    {Array.from({length: SESSION_TABLE_ROWS}, (_, hour) => (
                        <div key={hour} className="session-table-right-hour-container">
                            {startTime.plus({hours: hour}).setLocale("ru").toFormat('HH:mm')}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <SessionCreateEditForm onSubmit={onEditForm}
                               open={openEditForm}
                               onClose={() => setOpenEditForm(false)}
                               fieldId={fieldId}
                               session={editSession}

        />
        <SessionCreateEditForm onSubmit={onCreateForm}
                               open={openCreateForm}
                               onClose={() => setOpenCreateForm(false)}
                               fieldId={fieldId}

        />
    </>
}

export default AdminSessionTableController;

function useGetSessions(fieldId: number, startTime: DateTime) {
    return useQuery<SessionMap[]>({
        queryKey: [
            'admin-sessions',
            startTime
        ],
        queryFn: async () => {
            const sessions: SessionMap[] = [];
            for (let i = 0; i < DAYS_IN_WEEK; i++) {
                const session: SessionMap = {};
                const response = await sessionService.search(
                    fieldId,
                    startTime.plus({days: i}),
                    startTime.plus({days: i, hours: SESSION_TABLE_ROWS - 1}),
                    0,
                    SESSION_TABLE_ROWS
                )
                for (const fetchedSession of response.data.content) {
                    fetchedSession.startsAt = DateTime.fromISO(fetchedSession.startsAt.toString());
                    session[fetchedSession.startsAt.hour] = fetchedSession;
                }
                sessions.push(session);
            }
            return sessions;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}

function useDeleteSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sessionId: number) => {
            const response = await sessionService.delete(sessionId);
            return response.data;
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ['admin-sessions']}),
    });
}

function useUpdateSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (session: SessionCreateEditDto) => {
            const response = await sessionService.update(session.id!, session);
            return response.data;
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ['admin-sessions']}),
    });
}

function useCreateSessions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sessions: SessionMapCreate) => {
            const {week, session, startTime} = sessions;
            for (let day = 0; day < DAYS_IN_WEEK; day++) {
                for (let hour = 0; hour < SESSION_TABLE_ROWS; hour++) {
                    if (week[day][hour] == undefined) {
                        session.startsAt = startTime.plus({days: day, hours: hour});
                        await sessionService.create(session);
                    }
                }
            }
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ['admin-sessions']}),
    });
}
