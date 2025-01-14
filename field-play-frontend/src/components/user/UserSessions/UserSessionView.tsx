import React, {useState} from "react";
import {keepPreviousData, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Page from "../../../interfaces/Page.ts";
import SessionReadDto from "../../../interfaces/session/SessionReadDto.ts";
import sessionService from "../../../services/SessionService.ts";
import {CircularProgress, Pagination} from "@mui/material";
import UserSessionBlockContainer from "./UserSessionBlockContainer.tsx";
import {toast, ToastContainer} from "react-toastify";
import {AxiosError} from "axios";
import {PAGE_SIZE, UNHANDLED_ERROR_MESSAGE} from "../../../config/constants.tsx";
import {useAuth} from "../../../context/UserAuth.tsx";

const UserSessionView = () => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const {updateUser} = useAuth();

    const onCancelSignUp = async (sessionId: number) => {
        try {
            const response = await cancelSignUp(sessionId);
            toast.success(`Вы успешно отписались от данного сеанса.\nТекущий баланс: ${response.user.balance}`);
            updateUser(response.user);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 409 || error.status === 403) {
                    toast.error(error.response?.data.message);
                    return;
                }
            }
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }


    const handlePageIndexChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };


    const {
        data: page = {content: [], totalElements: 0},
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetSessions(pageIndex);

    const {mutateAsync: cancelSignUp, isPending: isCancelSignUpPending} = useCancelSignUp();


    return <div className="m-auto flex flex-col">
        {isLoadingError ? <span className="text-red-600">Произошла ошибка при загрузке сессий</span> : ''}
        {isLoading || isFetching || isCancelSignUpPending ? <CircularProgress/> : page.content.length === 0
            ? isLoadingError
                ? <span className="text-red-600">Произошла ошибка при загрузке сессий</span>
                : <span>Вы пока не записались ни на одну сессию</span>
            : ''
        }
        <UserSessionBlockContainer onCancelSignUp={onCancelSignUp} sessions={page.content}/>
        <Pagination className="pagination" count={Math.ceil(page.totalElements / PAGE_SIZE)} page={pageIndex}
                    onChange={handlePageIndexChange}/>
        <ToastContainer position="top-right"/>
    </div>
}

export default UserSessionView;


function useGetSessions(
    pageIndex: number) {
    return useQuery<Page<SessionReadDto>>({
        queryKey: [
            'my-sessions',
            pageIndex
        ],
        queryFn: async () => {
            const response = await sessionService.getAllMy(
                pageIndex - 1,
                PAGE_SIZE
            );
            return response.data;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}

function useCancelSignUp() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sessionId: number) => {
            const response = await sessionService.cancelSignUp(sessionId);
            return response.data;
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ['my-sessions']}),
    });
}
