import {SessionMap} from "../SessionTableController/SessionTableController.tsx";
import React from "react";
import {SESSION_TABLE_ROWS} from "../../../config/constants.tsx";
import {Status} from "../../../interfaces/session/Status.ts";
import RawSessionBlock from "../SessionBlock/RawSessionBlock.tsx";
import AdminSessionBlock from "../SessionBlock/AdminSessionBlock.tsx";
import SessionReadDto from "../../../interfaces/session/SessionReadDto.ts";

interface AdminSessionTableColumnProps {
    sessions: SessionMap;
    onEdit: (session: SessionReadDto) => void;
    onDelete: (sessionId: number) => void;
}

const AdminSessionTableColumn: React.FC<AdminSessionTableColumnProps> = (props) => {
    const {sessions, onEdit, onDelete} = props;
    return <div>
        {Array.from({length: SESSION_TABLE_ROWS}, (_, hour) => (
            <div key={hour}>
                {(sessions !== undefined && sessions[hour] !== undefined)
                    ? sessions[hour].status != Status.CLOSED ?
                        <AdminSessionBlock
                            session={sessions[hour]}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        /> : <RawSessionBlock/>
                    : <RawSessionBlock/>}
            </div>
        ))}
    </div>

}

export default AdminSessionTableColumn;