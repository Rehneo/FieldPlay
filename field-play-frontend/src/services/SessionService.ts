import apiService from "./ApiService.ts";
import SessionReadDto from "../interfaces/session/SessionReadDto.ts";
import Page from "../interfaces/Page.ts";
import {AxiosResponse} from "axios";
import SessionCreateDto from "../interfaces/session/SessionCreateDto.ts";
import SearchRequest from "../interfaces/search/SearchRequest.ts";
import SignUpReadDto from "../interfaces/session/SignUpReadDto.ts";
import BookingReadDto from "../interfaces/session/BookingReadDto.ts";
import {DateTime} from "luxon";
import {SearchOperator} from "../interfaces/search/SearchOperator.ts";

class SessionService {
    getAllMy = async (page: number, size: number): Promise<AxiosResponse<Page<SessionReadDto>>> => {
        return apiService.get<Page<SessionReadDto>>(`/sessions/my?page=${page}&size=${size}`)
    }

    search = async (fieldId: number | string, after: DateTime, before: DateTime): Promise<AxiosResponse<Page<SessionReadDto>>> => {
        const search: SearchRequest = {
            criteriaList: [
                {
                    key: 'startsAt',
                    value: after,
                    operator: SearchOperator.AFTER
                },
                {
                    key: 'startsAt',
                    value: before,
                    operator: SearchOperator.BEFORE
                },
                {
                    key: 'fieldId',
                    value: fieldId,
                    operator: SearchOperator.NESTED_FIELD_ID
                }
            ]
        }
        return apiService.post<Page<SessionReadDto>>
        (
            `/sessions/search`,
            search
        )
    }

    create = async (session: SessionCreateDto): Promise<AxiosResponse<SessionReadDto>> => {
        return apiService.post<SessionReadDto>(`/sessions`, session);
    }

    signUp = async (sessionId: number): Promise<AxiosResponse<SignUpReadDto>> => {
        return apiService.post<SignUpReadDto>(`/sessions/${sessionId}/sign-up`);
    }

    book = async (sessionId: number): Promise<AxiosResponse<BookingReadDto>> => {
        return apiService.post<BookingReadDto>(`/sessions/${sessionId}/book`);
    }

    cancelSignUp = async (sessionId: number): Promise<AxiosResponse<void>> => {
        return apiService.delete<void>(`/sessions/${sessionId}/cancel`);
    }
}

const sessionService = new SessionService();
export default sessionService;