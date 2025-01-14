import "./AdminRequest.css"
import AdminRequest from "../../../interfaces/admin/AdminRequest.ts";
import React from "react";
import {DateTime} from "luxon";
import {AdminRequestStatus} from "../../../interfaces/admin/AdminRequestStatus.ts";
import {Button} from "@mui/material";

interface AdminRequestBlockProps {
    request: AdminRequest;
    onApprove: (requestId: number) => void;
    onReject: (requestId: number) => void;
}

const AdminRequestBlock: React.FC<AdminRequestBlockProps> = ({request, onApprove, onReject}) => {
    return <div className="admin-request-block">
        <div className="request-info">
            <div>
                <span>Имя пользователя: </span>
                <span className="font-bold">{request.user.username}</span>
            </div>
            <div>
                <span>ID пользователя: </span>
                <span className="font-bold">{request.user.id}</span>
            </div>
            <div>
                <span>Дата создания: </span>
                <span className="font-bold">{DateTime.fromISO(request.createdAt.toString())
                    .toLocaleString(DateTime.DATETIME_MED)}</span>
            </div>
            {request.status != AdminRequestStatus.PENDING
                ? <>
                    <div>
                        <span>Обработано: </span>
                        <span className="font-bold">{request.approvedBy.username}</span>
                    </div>
                    <div>
                        <span>Дата обработки: </span>
                        <span className="font-bold">{DateTime.fromISO(request.approvedAt.toString())
                            .toLocaleString(DateTime.DATETIME_MED)}</span>
                    </div>
                </>
                : ''
            }
        </div>
        {request.status == AdminRequestStatus.PENDING
            ? <div className="admin-request-process-block">
                <Button variant="contained" onClick={() => onApprove(request.id)}>Одобрить</Button>
                <Button variant="outlined" onClick={() => onReject(request.id)}>Отклонить</Button>
            </div>
            : ''
        }
        <hr/>
    </div>

}

export default AdminRequestBlock;