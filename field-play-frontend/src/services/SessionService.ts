import apiService from "./ApiService.ts";
import SessionReadDto from "../interfaces/session/SessionReadDto.ts";
import Page from "../interfaces/Page.ts";
import {AxiosResponse} from "axios";
import SessionCreateDto from "../interfaces/session/SessionCreateDto.ts";
import SearchRequest from "../interfaces/search/SearchRequest.ts";
import {SortRequest} from "../interfaces/sort/SortRequest.ts";

class SessionService {
    getAllMy = async (page: number, size: number): Promise<AxiosResponse<Page<SessionReadDto>>> => {
        return apiService.get<Page<SessionReadDto>>(`/sessions/my?page=${page}&size=${size}`)
    }

    search = async (search: SearchRequest | null, page: number, size: number, sort: SortRequest | null): Promise<AxiosResponse<Page<SessionReadDto>>> => {
        let sortRequest = "";
        if (sort?.list) {
            sortRequest += sort.list.map((item) => `&sort=${item.key},${item.asc ? 'asc' : 'desc'}`).join('&sort=');
        }
        return apiService.post<Page<SessionReadDto>>
        (
            `/sessions/search?page=${page}&size=${size}${sortRequest}`,
            search
        )
    }

    create = async (session: SessionCreateDto): Promise<AxiosResponse<SessionReadDto>> => {
        return apiService.post<SessionReadDto>(`/sessions`, session);
    }
}

const sessionService = new SessionService();
export default sessionService;