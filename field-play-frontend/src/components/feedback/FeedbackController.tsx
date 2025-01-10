import React, {useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import Page from "../../interfaces/Page.ts";
import FeedbackReadDto from "../../interfaces/feedback/FeedbackReadDto.ts";
import feedbackService from "../../services/FeedbackService.ts";
import {CircularProgress, Pagination} from "@mui/material";
import FeedbackBlockContainer from "./FeedbackBlockContainer.tsx";
import "./FeedbackController.css"

interface FeedbackControllerProps {
    fieldId: string;
}

const FeedbackController: React.FC<FeedbackControllerProps> = ({fieldId}) => {

    const [pageIndex, setPageIndex] = useState<number>(1);

    const handlePageIndexChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };

    const {
        data: page = {content: [], totalElements: 0},
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetFeedbacks(fieldId, pageIndex);

    return <div className="m-auto flex flex-col gap-4">
        <span className="feedback-label">Отзывы</span>
        {isLoading || isFetching ? <CircularProgress/> : page.content.length === 0
            ? isLoadingError
                ? <span className="text-red-600">Произошла ошибка при загрузке отзывов</span>
                : 'Тут пока нет отзывов'
            : ''}
        <FeedbackBlockContainer feedbacks={page.content}/>
        <Pagination className="pagination"
                    count={Math.ceil(page.totalElements / 6)}
                    page={pageIndex}
                    onChange={handlePageIndexChange}/>
    </div>

}


export default FeedbackController;


function useGetFeedbacks(fieldId: number | string, pageIndex: number) {
    return useQuery<Page<FeedbackReadDto>>({
        queryKey: [
            'feedbacks',
            pageIndex
        ],
        queryFn: async () => {
            const response = await feedbackService.getAllByField(
                fieldId,
                pageIndex - 1,
                6
            );
            return response.data;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}
