import "./SessionBlock.css"
import SessionReadDto from "../../../interfaces/session/SessionReadDto.ts";
import React from "react";
import {Status} from "../../../interfaces/session/Status.ts";

interface AdminSessionBlockProps {
    session: SessionReadDto;
    onEdit: (session: SessionReadDto) => void;
    onDelete: (sessionId: number) => void;
}

const AdminSessionBlock: React.FC<AdminSessionBlockProps> = (props) => {
    const {session, onEdit, onDelete} = props;
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
        <div className="admin-session-price-container">
            <div className="flex flex-col">
                <span>Запись</span>
                <span className="font-bold">{session.signUpPrice}</span>
            </div>
            <div className="flex flex-col">
                <span>Брон.</span>
                <span className="font-bold">{session.bookingPrice}</span>
            </div>
        </div>
        <hr/>
        {
            (session.status == Status.ACTIVE && session.signUpCount == 0)
                ? (
                    <div className="admin-button-container">
                        <button className="edit-button" onClick={() => onEdit(session)}>
                            <span className="font-semibold">
                                Изменить
                            </span>
                        </button>
                        <button className="edit-button" onClick={() => onDelete(session.id)}>
                            <span className="font-semibold">
                                Удалить
                            </span>
                        </button>
                    </div>
                )
                : <div
                    className="text-red-600 text-center">{session.status == Status.BOOKED ? "Забронировано" : 'Занято'}</div>
        }
    </div>
}

export default AdminSessionBlock;