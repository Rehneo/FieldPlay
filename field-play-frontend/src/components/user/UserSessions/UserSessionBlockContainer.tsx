import SessionReadDto from "../../../interfaces/session/SessionReadDto.ts";
import React from "react";
import UserSessionBlock from "./UserSessionBlock.tsx";
import "./UserSessionBlockContainer.css"

interface UserSessionBlockContainerProps {
    sessions: SessionReadDto[];
    onCancelSignUp: (sessionId: number) => void;
}

const UserSessionBlockContainer: React.FC<UserSessionBlockContainerProps> = ({sessions, onCancelSignUp}) => {
    return <div className="user-session-container">
        {sessions.map((session) => {
            return <UserSessionBlock key={session.id} onCancelSignUp={onCancelSignUp} session={session}/>
        })}
    </div>
}

export default UserSessionBlockContainer;