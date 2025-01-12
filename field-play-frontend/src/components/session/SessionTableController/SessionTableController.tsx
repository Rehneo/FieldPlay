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

interface SessionTableControllerProps {
    fieldId: number;
}

export type SessionMap = Record<number, SessionReadDto | undefined>;

const SessionTableController: React.FC<SessionTableControllerProps> = ({fieldId}) => {
    const {isLoggedIn, setUser} = useAuth();
    const navigate = useNavigate();
    const [signUpError, setSignUpError] = useState<string>('');
    const [bookError, setBookError] = useState<string>('');
    const [cancelSignUpError, setCancelSignUpError] = useState<string>('');

    const onSignUp = async (sessionId: number) => {
        if (!isLoggedIn()) navigate('/sign-in')
        try {
            const response = await signUp(sessionId);
            setUser(response.user);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 409 || error.status === 403) {
                    setSignUpError(error.message);
                    return;
                }
            }
            setSignUpError(UNHANDLED_ERROR_MESSAGE);
        }
    }

    const onBook = async (sessionId: number) => {
        if (!isLoggedIn()) navigate('/sign-in')
        try {
            const response = await book(sessionId);
            setUser(response.user);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 409 || error.status === 403) {
                    setSignUpError(error.message);
                    return;
                }
            }
            setBookError(UNHANDLED_ERROR_MESSAGE);
        }
    }

    const onCancelSignUp = async (sessionId: number) => {
        if (!isLoggedIn()) navigate('/sign-in')
        try {
            await cancelSignUp(sessionId);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 409 || error.status === 403) {
                    setCancelSignUpError(error.message);
                    return;
                }
            }
            setCancelSignUpError(UNHANDLED_ERROR_MESSAGE);
        }
    }

    const [startTime, setStartTime] = useState<DateTime>
    (
        DateTime.fromISO("2024-12-21T13:00:00+00:00")
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
    return <div className="session-table-controller-container">
        <div className="session-table-header">
            <span className="session-select-label">Выберите сеанс</span>
            {isLoading || isFetching || isSignUpPending || isBookPending || isCancelSignUpPending ?
                <CircularProgress/> : ''}
            <SessionTableWeekController startTime={startTime} setStartTime={setStartTime}/>
        </div>
        <div className="session-table-container">
            <div className="session-table-hours-column">
                {Array.from({length: SESSION_TABLE_ROWS}, (_, hour) => (
                    <div key={hour} className="session-table-left-hour-container">
                        {startTime.plus({hours: hour}).setLocale("ru").toFormat('HH:mm')}
                    </div>
                ))}
            </div>
            {
                Array.from({length: DAYS_IN_WEEK}, (_, day) => (
                    <SessionTableColumn key={day}
                                        sessions={sessions[day]}
                                        onSignUp={onSignUp}
                                        onCancelSignUp={onCancelSignUp}
                                        onBook={onBook}
                    />
                ))
            }
            <div className="session-table-hours-column">
                {Array.from({length: SESSION_TABLE_ROWS}, (_, hour) => (
                    <div key={hour} className="session-table-right-hour-container">
                        {startTime.plus({hours: hour}).setLocale("ru").toFormat('HH:mm')}
                    </div>
                ))}
            </div>
        </div>
    </div>

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
                    startTime.plus({days: i, hours: SESSION_TABLE_ROWS}),
                )
                response.data.content.map((fetchedSession) => {
                    fetchedSession.startsAt = DateTime.fromISO(fetchedSession.startsAt.toString());
                    session[fetchedSession.startsAt.hour] = fetchedSession;
                })
                sessions.push(session);
            }
            console.log(sessions);
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

