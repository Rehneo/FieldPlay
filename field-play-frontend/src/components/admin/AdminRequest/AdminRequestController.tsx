import React, {useState} from "react";
import {AdminRequestStatus} from "../../../interfaces/admin/AdminRequestStatus.ts";
import {keepPreviousData, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Page from "../../../interfaces/Page.ts";
import {PAGE_SIZE, UNHANDLED_ERROR_MESSAGE} from "../../../config/constants.tsx";
import AdminRequest from "../../../interfaces/admin/AdminRequest.ts";
import companyService from "../../../services/CompanyService.ts";
import {Button, CircularProgress, Pagination} from "@mui/material";
import AdminRequestBlockContainer from "./AdminRequestBlockContainer.tsx";
import "./AdminRequest.css"
import {toast, ToastContainer} from "react-toastify";

const AdminRequestController = ({companyId}: { companyId: number }) => {
    const [status, setStatus] = useState<AdminRequestStatus>(AdminRequestStatus.PENDING);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const handlePageIndexChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };
    const {
        data: page = {content: [], totalElements: 0},
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetRequests(companyId, status, pageIndex);

    const {mutateAsync: approveRequest, isPending: isApprovePending} = useApproveRequest();
    const {mutateAsync: rejectRequest, isPending: isRejectPending} = useRejectRequest();

    const onApprove = async (requestId: number) => {
        try {
            await approveRequest(requestId);
            toast.success("Заявка была успешно одобрена");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }

    const onReject = async (requestId: number) => {
        try {
            await rejectRequest(requestId);
            toast.success("Заявка была успешно отклонена");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }

    return <div className="m-auto flex flex-col gap-4">
        <span className="admin-request-label">Заявки</span>
        <div className="select-status-container">
            <Button variant={status == AdminRequestStatus.APPROVED ? "contained" : "outlined"}
                    onClick={() => setStatus(AdminRequestStatus.APPROVED)}
            >Одобренные
            </Button>
            <Button variant={status == AdminRequestStatus.PENDING ? "contained" : "outlined"}
                    onClick={() => setStatus(AdminRequestStatus.PENDING)}
            >Ожидающие</Button>
            <Button variant={status == AdminRequestStatus.REJECTED ? "contained" : "outlined"}
                    onClick={() => setStatus(AdminRequestStatus.REJECTED)}
            >Отклоненные</Button>
        </div>
        {isLoading || isFetching || isApprovePending || isRejectPending ?
            <CircularProgress/> : page.content.length === 0
                ? isLoadingError
                    ? <span className="text-red-600">Произошла ошибка при загрузке заявок</span>
                    : 'Тут пока нет заявок'
                : ''}
        <AdminRequestBlockContainer
            requests={page.content}
            onApprove={onApprove}
            onReject={onReject}
        />
        <Pagination className="pagination"
                    count={Math.ceil(page.totalElements / PAGE_SIZE)}
                    page={pageIndex}
                    onChange={handlePageIndexChange}/>
        <ToastContainer/>
    </div>
}

export default AdminRequestController;

function useGetRequests(companyId: number, status: AdminRequestStatus, pageIndex: number) {
    return useQuery<Page<AdminRequest>>({
        queryKey: [
            'admin-requests',
            status,
            companyId
        ],
        queryFn: async () => {
            const response = await companyService.getAllRequestsByCompany(
                companyId,
                status,
                pageIndex - 1,
                PAGE_SIZE
            )
            return response.data;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}

function useApproveRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (requestId: number) => {
            const response = await companyService.processRequest(requestId, true);
            return response.data;
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ['admin-requests']}),
    });
}

function useRejectRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (requestId: number) => {
            const response = await companyService.processRequest(requestId, false);
            return response.data;
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ['admin-requests']}),
    });
}

