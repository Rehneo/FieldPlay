import AdminRequest from "../../../interfaces/admin/AdminRequest.ts";
import React from "react";
import AdminRequestBlock from "./AdminRequestBlock.tsx";
import "./AdminRequest.css"

interface AdminRequestBlockContainerProps {
    requests: AdminRequest[];
    onApprove: (requestId: number) => void;
    onReject: (requestId: number) => void;
}

export const AdminRequestBlockContainer: React.FC<AdminRequestBlockContainerProps> = ({
                                                                                          requests,
                                                                                          onReject,
                                                                                          onApprove
                                                                                      }) => {
    return <div className="admin-request-block-container">
        {requests.map((request) => {
            return <AdminRequestBlock key={request.id}
                                      request={request}
                                      onReject={onReject}
                                      onApprove={onApprove}

            />
        })}
    </div>
}

export default AdminRequestBlockContainer;