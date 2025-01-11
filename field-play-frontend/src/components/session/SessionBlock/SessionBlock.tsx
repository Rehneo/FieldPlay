import SessionReadDto from "../../../interfaces/session/SessionReadDto.ts";
import React from "react";

interface SessionBlockProps {
    session: SessionReadDto;
    onSignUp: (sessionId: number) => void;
    onBook: (sessionId: number) => void;
    onCancelSignUp: (sessionId: number) => void;
}

const SessionBlock: React.FC<SessionBlockProps> = (props) => {
    const {onSignUp, onBook, onCancelSignUp, session} = props;
    return <div>

    </div>

}

export default SessionBlock;