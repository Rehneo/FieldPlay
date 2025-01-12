import {SessionMap} from "../SessionTableController/SessionTableController.tsx";
import React from "react";
import {SESSION_TABLE_ROWS} from "../../../config/constants.tsx";
import RawSessionBlock from "../SessionBlock/RawSessionBlock.tsx";
import SessionBlock from "../SessionBlock/SessionBlock.tsx";

interface SessionTableColumnProps {
    sessions: SessionMap;
    onSignUp: (sessionId: number) => void;
    onBook: (sessionId: number) => void;
    onCancelSignUp: (sessionId: number) => void;
}

const SessionTableColumns: React.FC<SessionTableColumnProps> = (props) => {
    const {sessions, onSignUp, onBook, onCancelSignUp} = props;
    return <div>
        {Array.from({length: SESSION_TABLE_ROWS}, (_, hour) => (
            <div key={hour}>
                {(sessions !== undefined && sessions[hour] !== undefined)
                    ? <SessionBlock onSignUp={onSignUp}
                                    session={sessions[hour]}
                                    onCancelSignUp={onCancelSignUp}
                                    onBook={onBook}
                    />
                    : <RawSessionBlock/>}
            </div>
        ))}
    </div>
}

export default SessionTableColumns;