import SessionReadDto from "../../../interfaces/session/SessionReadDto.ts";
import React from "react";
import {Status} from "../../../interfaces/session/Status.ts";

interface SessionBlockProps {
    session: SessionReadDto;
    onSignUp: (sessionId: number) => void;
    onBook: (sessionId: number) => void;
    onCancelSignUp: (sessionId: number) => void;
}

const SessionBlock: React.FC<SessionBlockProps> = (props) => {
    const {onSignUp, onBook, onCancelSignUp, session} = props;
    return <div className="session-block">
        <div className="session-info-container">
            <div className="sign-up-count-container">
                {session.signUpCount < session.minPlayers
                    ? <span className="text-red-600">{session.signUpCount}</span>
                    : <span className="text-green-700">{session.signUpCount}</span>
                }
                <span>/</span>
                <span>{session.maxPlayers}</span>
            </div>
        </div>
        <hr className="session-block-divider"/>
        <div className="session-book-container">
            {session.isSignedUp ?
                <div>
                    <span className="text-green-600 font-semibold">Вы записаны</span>
                    <button className="sign-up-button cancel-button">
                        <div className="font-semibold" onClick={() => onCancelSignUp(session.id)}>
                            Отписаться
                        </div>
                    </button>
                </div>
                : session.isBooked
                    ? <span className="text-green-600 font-semibold">Вы забронировали</span>
                    : session.status == Status.BOOKED
                        ? <span className="text-red-600 font-semibold">Сессия забронирована</span>
                        : session.status == Status.FILLED
                            ? <span className="text-red-600 font-semibold">Сессия заполнена</span>
                            : <>
                                <div className="sign-up-container">
                                    <div>
                                        Запись
                                    </div>
                                    <button className="sign-up-button">
                                        <div className="font-semibold" onClick={() => onSignUp(session.id)}>
                                            {session.signUpPrice} р.
                                        </div>
                                    </button>
                                </div>
                                <div className="book-container">
                                    <div>
                                        Брон.
                                    </div>
                                    <button className="sign-up-button">
                                        <div className="font-semibold" onClick={() => onBook(session.id)}>
                                            {session.bookingPrice} р.
                                        </div>
                                    </button>
                                </div>
                            </>
            }
        </div>
    </div>

}

export default SessionBlock;