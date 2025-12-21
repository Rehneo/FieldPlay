import React, {useState} from "react";
import sessionService from "../../../services/SessionService.ts";
import {useAuth} from "../../../context/UserAuth.tsx";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";
import {DAYS_IN_WEEK, SESSION_TABLE_ROWS, UNHANDLED_ERROR_MESSAGE} from "../../../config/constants.tsx";
import SessionReadDto from "../../../interfaces/session/SessionReadDto.ts";
import {keepPreviousData, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {DateTime} from "luxon";
import "./SessionTableController.css"
import {CircularProgress} from "@mui/material";
import SessionTableWeekController from "./SessionTableTimeController.tsx";
import SessionTableColumn from "../SessionTable/SessionTableColumn.tsx";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SessionTableControllerProps {
    fieldId: number;
}

export type SessionMap = Record<number, SessionReadDto | undefined>;

const SessionTableController: React.FC<SessionTableControllerProps> = ({fieldId}) => {
    const {isLoggedIn, updateUser} = useAuth();
    const navigate = useNavigate();

    const onSignUp = async (sessionId: number) => {
        if (!isLoggedIn()) navigate('/sign-in')
        try {
            const response = await signUp(sessionId);
            toast.success(`Вы успешно записались на данный сеанс.\nТекущий баланс: ${response.user.balance}`);
            updateUser(response.user);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 409 || error.status === 403 || error.status === 400) {
                    toast.error(error.response?.data.message);
                    console.error(error.response?.data.message);
                    return;
                }
            }
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }

    const onBook = async (sessionId: number) => {
        if (!isLoggedIn()) navigate('/sign-in')
        try {
            const response = await book(sessionId);
            toast.success(`Вы забронировали данный сеанс.\nТекущий баланс: ${response.user.balance}`);
            updateUser(response.user);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 409 || error.status === 403 || error.status === 400) {
                    toast.error(error.response?.data.message);
                    return;
                }
            }
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }

    const onCancelSignUp = async (sessionId: number) => {
        if (!isLoggedIn()) navigate('/sign-in')
        try {
            const response = await cancelSignUp(sessionId);
            toast.success(`Вы успешно отписались от данного сеанса.\nТекущий баланс: ${response.user.balance}`);
            updateUser(response.user);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 409 || error.status === 403) {
                    toast.error(error.response?.data.message);
                    return;
                }
            }
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }

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

    const {mutateAsync: signUp, isPending: isSignUpPending} = useSignUp();
    const {mutateAsync: book, isPending: isBookPending} = useBook();
    const {mutateAsync: cancelSignUp, isPending: isCancelSignUpPending} = useCancelSignUp();
    return <>
        <div className="session-table-controller-container">
            <div className="session-table-header-container">
                <span className="session-select-label">Выберите сеанс</span>
                {isLoading || isFetching || isSignUpPending || isBookPending || isCancelSignUpPending ?
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
                    <SessionTableColumn key={day}
                                        sessions={sessions[day]}
                                        onSignUp={onSignUp}
                                        onCancelSignUp={onCancelSignUp}
                                        onBook={onBook}/>
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
        <ToastContainer position="top-right"/></>

}

export default SessionTableController;

function useGetSessions(fieldId: number, startTime: DateTime) {
    return useQuery<SessionMap[]>({
        queryKey: [
            'sessions',
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


function useSignUp() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sessionId: number) => {
            const response = await sessionService.signUp(sessionId);
            return response.data;
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ['sessions']}),
    });
}

function useBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sessionId: number) => {
            const response = await sessionService.book(sessionId);
            return response.data;
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ['sessions']}),
    });
}

function useCancelSignUp() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sessionId: number) => {
            const response = await sessionService.cancelSignUp(sessionId);
            return response.data;
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ['sessions']}),
    });
}

