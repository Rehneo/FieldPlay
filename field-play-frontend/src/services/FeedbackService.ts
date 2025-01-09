import apiService from "./ApiService.ts";
import FeedbackReadDto from "../interfaces/feedback/FeedbackReadDto.ts";
import Page from "../interfaces/Page.ts";
import {AxiosResponse} from "axios";
import FeedbackCreateDto from "../interfaces/feedback/FeedbackCreateDto.ts";

class FeedbackService {

    getAllMy = async (page: number, size: number): Promise<AxiosResponse<Page<FeedbackReadDto>>> => {
        return apiService.get<Page<FeedbackReadDto>>(`/feedbacks/my?page=${page}&size=${size}`);
    }

    getAllByField = async (fieldId: number, page: number, size: number): Promise<AxiosResponse<Page<FeedbackReadDto>>> => {
        return apiService.get<Page<FeedbackReadDto>>(`/feedbacks/?fieldId=${fieldId}&page=${page}&size=${size}`);
    }

    create = async (feedback: FeedbackCreateDto): Promise<AxiosResponse<FeedbackReadDto>> => {
        return apiService.post<FeedbackReadDto>(`/feedbacks`, feedback);
    }

    delete = async (id: number): Promise<AxiosResponse<void>> => {
        return apiService.delete<void>(`/feedbacks/${id}`);
    }
}

const feedbackService = new FeedbackService();
export default feedbackService;