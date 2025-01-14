import React, {useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import Page from "../../../interfaces/Page.ts";
import FeedbackReadDto from "../../../interfaces/feedback/FeedbackReadDto.ts";
import feedbackService from "../../../services/FeedbackService.ts";
import UserFeedbackBlockContainer from "./UserFeedbackBlockContainer.tsx";
import {CircularProgress, Pagination} from "@mui/material";
import {PAGE_SIZE} from "../../../config/constants.tsx";

const UserFeedbackView = () => {
    const [pageIndex, setPageIndex] = useState<number>(1);


    const handlePageIndexChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };


    const {
        data: page = {content: [], totalElements: 0},
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetFeedbacks(pageIndex);

    return <div className="m-auto flex flex-col">
        {isLoading || isFetching ? <CircularProgress/> : page.content.length === 0
            ? isLoadingError
                ? <span className="text-red-600">Произошла ошибка при загрузке отзывов</span>
                : <span>Вы пока не оставили ни одного отзыва</span>
            : ''}
        <UserFeedbackBlockContainer feedbacks={page.content}/>
        <Pagination className="pagination" count={Math.ceil(page.totalElements / PAGE_SIZE)} page={pageIndex}
                    onChange={handlePageIndexChange}/>
    </div>

}

export default UserFeedbackView;

function useGetFeedbacks(
    pageIndex: number) {
    return useQuery<Page<FeedbackReadDto>>({
        queryKey: [
            'my-feedbacks',
            pageIndex
        ],
        queryFn: async () => {
            const response = await feedbackService.getAllMy(
                pageIndex - 1,
                PAGE_SIZE
            );
            return response.data;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}