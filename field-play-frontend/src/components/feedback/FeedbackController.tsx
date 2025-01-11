import React, {useState} from "react";
import {keepPreviousData, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Page from "../../interfaces/Page.ts";
import FeedbackReadDto from "../../interfaces/feedback/FeedbackReadDto.ts";
import feedbackService from "../../services/FeedbackService.ts";
import {
    Button,
    CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Pagination,
    Rating,
    TextField
} from "@mui/material";
import FeedbackBlockContainer from "./FeedbackBlockContainer.tsx";
import "./FeedbackController.css"
import FeedbackCreateDto from "../../interfaces/feedback/FeedbackCreateDto.ts";
import {useAuth} from "../../context/UserAuth.tsx";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";
import {UNHANDLED_ERROR_MESSAGE} from "../../config/constants.tsx";

interface FeedbackControllerProps {
    fieldId: number;
}

const FeedbackController: React.FC<FeedbackControllerProps> = ({fieldId}) => {
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const [rating, setRating] = React.useState<number | null>(5);
    const [message, setMessage] = useState("");
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [formError, setFormError] = useState("");
    const [openForm, setOpenForm] = useState<boolean>(false);

    const handleFormOpen = () => {
        if (isLoggedIn()) {
            setOpenForm(true);
        } else {
            navigate("/sign-in")
        }
    };

    const handleFormClose = () => {
        setOpenForm(false);
        setFormError("");
        setMessage("");
        setRating(5);
    };

    const handleSubmit = async () => {
        if (!message.trim()) {
            setFormError("Пожалуйста, введите текст отзыва");
            return;
        }
        if (message.length < 4) {
            setFormError("Пожалуйста, введите нормальный отзыв")
            return;
        }
        try {
            await createFeedback(
                {
                    fieldId: Number(fieldId),
                    message: message,
                    rating: rating!
                })
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 409) {
                    setFormError("Вы уже оставляли отзыв к данному полю");
                    return;
                }
            }
            setFormError(UNHANDLED_ERROR_MESSAGE);
            return;
        }
        setFormError("");
        handleFormClose();
    };


    const handlePageIndexChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };

    const {
        data: page = {content: [], totalElements: 0},
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetFeedbacks(fieldId, pageIndex);

    const {mutateAsync: createFeedback, isPending: isCreatePending} = useCreateFeedback();

    return <div className="m-auto flex flex-col gap-4">
        <span className="feedback-label">Отзывы</span>
        {isLoading || isFetching ? <CircularProgress/> : page.content.length === 0
            ? isLoadingError
                ? <span className="text-red-600">Произошла ошибка при загрузке отзывов</span>
                : 'Тут пока нет отзывов'
            : ''}
        <FeedbackBlockContainer feedbacks={page.content}/>
        <Button onClick={handleFormOpen} sx={{width: 200}} variant="contained">Добавить отзыв</Button>
        <Pagination className="pagination"
                    count={Math.ceil(page.totalElements / 6)}
                    page={pageIndex}
                    onChange={handlePageIndexChange}/>
        <Dialog open={openForm} onClose={handleFormClose}>
            <DialogTitle>Добавить отзыв</DialogTitle>
            <DialogContent className="flex flex-col">
                <Rating
                    value={rating}
                    onChange={(_event, newValue) => {
                        setRating(newValue);
                    }}
                />
                <TextField
                    sx={{width: 400}}
                    multiline
                    rows={4}
                    margin="dense"
                    label="Введите отзыв..."
                    variant="outlined"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    error={!!formError}
                    helperText={formError}
                />
            </DialogContent>
            {isCreatePending ? <CircularProgress className="m-auto"/> : ''}
            <DialogActions>
                <Button onClick={handleFormClose} color="secondary">
                    Отмена
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Добавить
                </Button>
            </DialogActions>
        </Dialog>
    </div>

}


export default FeedbackController;


function useGetFeedbacks(fieldId: number, pageIndex: number) {
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

function useCreateFeedback() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (feedback: FeedbackCreateDto) => {
            const response = await feedbackService.create(feedback);
            return response.data;
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ['feedbacks']}),
    });
}
