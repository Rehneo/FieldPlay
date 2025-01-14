import SessionReadDto from "../../../interfaces/session/SessionReadDto.ts";
import React from "react";
import {Status} from "../../../interfaces/session/Status.ts";
import "./UserSessionBlock.css"
import {DateTime} from "luxon";

interface UserSessionBlockProps {
    session: SessionReadDto;
    onCancelSignUp: (sessionId: number) => void;
}


const UserSessionBlock: React.FC<UserSessionBlockProps> = ({session, onCancelSignUp}) => {
    const startsAt = DateTime.fromISO(session.startsAt.toString());
    return <div className="user-session-block">
        <div>
            {session.status == Status.CLOSED
                ? <span className="text-red-600">Завершенный</span>
                : <span className="text-green-700">Активный</span>
            }
            <div className="user-session-field-date">
                <span className="user-field-name">{session.fieldName}</span>
                <span className="user-session-date">{startsAt.toLocaleString(DateTime.DATE_MED)}</span>
            </div>
            {session.status == Status.ACTIVE
                ? <button className="user-cancel-button" onClick={() => onCancelSignUp(session.id)}>Отписаться</button>
                : ''
            }
        </div>
        <div className="user-session-details">
            <div className="user-player-count">
                {session.status == Status.BOOKED
                    ? 'Брон.'
                    : <>
                        {
                            session.signUpCount < session.minPlayers
                                ? <span className="text-red-600">{session.signUpCount}</span>
                                : <span className="text-green-700">{session.signUpCount}</span>

                        }
                        <span>/</span>
                        <span>{session.maxPlayers}</span>
                    </>

                }
            </div>
            <span className="user-session-hours">{
                startsAt.hour + ":00" + " - " + (startsAt.hour + 1) + ":00"
            }</span>
        </div>
    </div>
}

export default UserSessionBlock;