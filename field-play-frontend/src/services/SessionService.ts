import apiService from "./ApiService.ts";
import SessionReadDto from "../interfaces/session/SessionReadDto.ts";
import Page from "../interfaces/Page.ts";
import {AxiosResponse} from "axios";
import SearchRequest from "../interfaces/search/SearchRequest.ts";
import SignUpReadDto from "../interfaces/session/SignUpReadDto.ts";
import BookingReadDto from "../interfaces/session/BookingReadDto.ts";
import {DateTime} from "luxon";
import {SearchOperator} from "../interfaces/search/SearchOperator.ts";
import SignedUpResponse from "../interfaces/session/SignedUpResponse.ts";
import BookedResponse from "../interfaces/session/BookedResponse.ts";
import SessionCreateEditDto from "../interfaces/session/SessionCreateEditDto.ts";

class SessionService {
    getAllMy = async (page: number, size: number): Promise<AxiosResponse<Page<SessionReadDto>>> => {
        return apiService.get<Page<SessionReadDto>>(`/sessions/my?page=${page}&size=${size}`)
    }

    search = async (
        fieldId: number | string,
        after: DateTime,
        before: DateTime,
        page?: number,
        size?: number
    ): Promise<AxiosResponse<Page<SessionReadDto>>> => {
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
            `/sessions/search?page=${page}&size=${size}`,
            search
        )
    }

    create = async (session: SessionCreateEditDto): Promise<AxiosResponse<SessionReadDto>> => {
        return apiService.post<SessionReadDto>(`/sessions`, session);
    }

    update = async (sessionId: number, session: SessionCreateEditDto): Promise<AxiosResponse<SessionReadDto>> => {
        return apiService.patch<SessionReadDto>(`/sessions/${sessionId}`, session);
    }

    delete = async (sessionId: number): Promise<AxiosResponse<void>> => {
        return apiService.delete<void>(`/sessions/${sessionId}`);
    }

    signUp = async (sessionId: number): Promise<AxiosResponse<SignUpReadDto>> => {
        return apiService.post<SignUpReadDto>(`/sessions/${sessionId}/sign-up`);
    }

    book = async (sessionId: number): Promise<AxiosResponse<BookingReadDto>> => {
        return apiService.post<BookingReadDto>(`/sessions/${sessionId}/book`);
    }

    cancelSignUp = async (sessionId: number): Promise<AxiosResponse<SignUpReadDto>> => {
        return apiService.delete<SignUpReadDto>(`/sessions/${sessionId}/cancel`);
    }

    isSignedUp = async (sessionId: number) => {
        try {
            const response = await apiService.get<SignedUpResponse>(`/sessions/is-signed-up?sessionId=${sessionId}`);
            return response.data.signedUp;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return false;
        }
    }

    isBooked = async (sessionId: number) => {
        try {
            const response = await apiService.get<BookedResponse>(`/sessions/is-booked?sessionId=${sessionId}`);
            return response.data.booked;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return false;
        }
    }
}

const sessionService = new SessionService();
export default sessionService;