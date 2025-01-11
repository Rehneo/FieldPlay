import React, {useState} from "react";
import sessionService from "../../../services/SessionService.ts";
import {useAuth} from "../../../context/UserAuth.tsx";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";
import {DAYS_IN_WEEK, SESSION_TABLE_ROWS, UNHANDLED_ERROR_MESSAGE} from "../../../config/constants.tsx";
import SessionReadDto from "../../../interfaces/session/SessionReadDto.ts";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {DateTime} from "luxon";
import "./SessionTableController.css"

interface SessionTableControllerProps {
    fieldId: string;
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
            const response = await sessionService.signUp(sessionId);
            setUser(response.data.user);
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
            const response = await sessionService.book(sessionId);
            setUser(response.data.user);
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
            const response = await sessionService.book(sessionId);
            setUser(response.data.user);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 409 || error.status === 403) {
                    setSignUpError(error.message);
                    return;
                }
            }
            setCancelSignUpError(UNHANDLED_ERROR_MESSAGE);
        }
    }

    const [startDate, setStartDate] = useState<DateTime>
    (
        DateTime.fromISO("2024-12-21T13:00:00+00:00")
    );

    const {
        data: sessions,
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetSessions(startDate, fieldId);


    return <div className="session-table-controller-container">
        <span className="session-select-label">Выберите сеанс</span>
    </div>

}

export default SessionTableController;

function useGetSessions(startDate: DateTime, fieldId: string) {
    return useQuery<SessionMap[]>({
        queryKey: [
            'sessions',
            startDate
        ],
        queryFn: async () => {
            const sessions: SessionMap[] = [];
            for (let i = 0; i < DAYS_IN_WEEK; i++) {
                const session: SessionMap = {};
                const response = await sessionService.search(
                    fieldId,
                    startDate.plus({days: i}),
                    startDate.plus({days: i, hours: SESSION_TABLE_ROWS}),
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