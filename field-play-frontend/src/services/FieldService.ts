import SearchRequest from "../interfaces/search/SearchRequest.ts";
import {SortRequest} from "../interfaces/sort/SortRequest.ts";
import {AxiosResponse} from "axios";
import Page from "../interfaces/Page.ts";
import FieldReadDto from "../interfaces/field/FieldReadDto.ts";
import apiService from "./ApiService.ts";
import FieldFullReadDto from "../interfaces/field/FieldFullReadDto.ts";
import FieldCreateDto from "../interfaces/field/FieldCreateDto.ts";
import FieldEditDto from "../interfaces/field/FieldEditDto.ts";

class FieldService {

    search = async (search: SearchRequest | null, page: number, size: number, sort: SortRequest | null): Promise<AxiosResponse<Page<FieldReadDto>>> => {
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

    create = async (field: FieldCreateDto): Promise<AxiosResponse<FieldFullReadDto>> => {
        return apiService.post<FieldFullReadDto>('/football-fields', field);
    }

    update = async (id: number, field: FieldEditDto): Promise<AxiosResponse<FieldFullReadDto>> => {
        return apiService.patch<FieldFullReadDto>(`/football-fields/${id}`, field);
    }


}

const fieldService = new FieldService();
export default fieldService;