import SearchRequest from "../interfaces/search/SearchRequest.ts";
import {SortRequest} from "../interfaces/sort/SortRequest.ts";
import {AxiosResponse} from "axios";
import Page from "../interfaces/Page.ts";
import FieldReadDto from "../interfaces/field/FieldReadDto.ts";
import apiService from "./ApiService.ts";
import FieldFullReadDto from "../interfaces/field/FieldFullReadDto.ts";
import FieldCreateEditDto from "../interfaces/field/FieldCreateEditDto.ts";

class FieldService {

    search = async (
        search: SearchRequest | null,
        page: number, size: number,
        sort: SortRequest | null): Promise<AxiosResponse<Page<FieldReadDto>>> => {
        let sortRequest = "";
        if (sort?.list) {
            sortRequest += sort.list.map((item) => `&sort=${item.key},${item.asc ? 'asc' : 'desc'}`).join('&sort=');
        }
        return apiService.post<Page<FieldReadDto>>
        (
            `/football-fields/search?page=${page}&size=${size}${sortRequest}`,
            search
        )
    }

    getById = async (id: number): Promise<AxiosResponse<FieldFullReadDto>> => {
        return apiService.get<FieldFullReadDto>(`/football-fields/${id}`);
    }

    create = async (field: FieldCreateEditDto): Promise<AxiosResponse<FieldFullReadDto>> => {
        return apiService.post<FieldFullReadDto>('/football-fields', field);
    }

    update = async (id: number, field: FieldCreateEditDto): Promise<AxiosResponse<FieldFullReadDto>> => {
        return apiService.patch<FieldFullReadDto>(`/football-fields/${id}`, field);
    }

    getAllByCompany = async (companyId: number, page: number, size: number): Promise<AxiosResponse<Page<FieldReadDto>>> => {
        return apiService.get<Page<FieldReadDto>>(`/football-fields?companyId=${companyId}&page=${page}&size=${size}`);
    }


}

const fieldService = new FieldService();
export default fieldService;