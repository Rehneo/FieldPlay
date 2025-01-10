import SessionReadDto from "../../../interfaces/session/SessionReadDto.ts";
import React from "react";
import UserSessionBlock from "./UserSessionBlock.tsx";
import "./UserSessionBlockContainer.css"

interface UserSessionBlockContainerProps {
    sessions: SessionReadDto[];
}

const UserSessionBlockContainer: React.FC<UserSessionBlockContainerProps> = ({sessions}) => {
    return <div className="user-session-container">
        {sessions.map((session) => {
            return <UserSessionBlock key={session.id} session={session}/>
        })}
    </div>
}

export default UserSessionBlockContainer;