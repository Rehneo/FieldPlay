import "./UserSessionView.css"
import React, {useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import Page from "../../../interfaces/Page.ts";
import SessionReadDto from "../../../interfaces/session/SessionReadDto.ts";
import sessionService from "../../../services/SessionService.ts";
import {CircularProgress, Pagination} from "@mui/material";
import UserSessionBlockContainer from "./UserSessionBlockContainer.tsx";

const UserSessionView = () => {
    const [pageIndex, setPageIndex] = useState<number>(1);


    const handlePageIndexChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };


    const {
        data: page = {content: [], totalElements: 0},
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetSessions(pageIndex);


    return <div className="session-view-container">
        {isLoadingError ? <span className="text-red-600">Произошла ошибка при загрузке сессий</span> : ''}
        {isLoading || isFetching ? <CircularProgress/> : ''}
        <UserSessionBlockContainer sessions={page.content}/>
        <Pagination className="pagination" count={Math.ceil(page.totalElements / 6)} page={pageIndex}
                    onChange={handlePageIndexChange}/>
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
            const response = await sessionService.getAllMy(pageIndex - 1, 6);
            return response.data;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}