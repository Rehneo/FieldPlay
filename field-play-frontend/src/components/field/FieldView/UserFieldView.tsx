import {useState} from "react";
import SearchRequest from "../../../interfaces/search/SearchRequest.ts";
import FieldFilter from "../FieldFilter/FieldFilter.tsx";
import FieldBlockContainer from "../FieldBlockContainer/FieldBlockContainer.tsx";
import FieldReadDto from "../../../interfaces/field/FieldReadDto.ts";
import PaginationState from "../../../interfaces/PaginationState.ts";
import "./FieldView.css"
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import Page from "../../../interfaces/Page.ts";
import fieldService from "../../../services/FieldService.ts";
import {CircularProgress} from "@mui/material";

const UserFieldView = (() => {

    const [searchRequest, setSearchRequest] = useState<SearchRequest>({criteriaList: []})
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 9,
    });

    const {
        data: page = {content: [], totalElements: 0},
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetFields(searchRequest, pagination);


    return <div className="field-view-container">
        <span className="field-select-label">Выберите поле</span>
        <FieldFilter onApply={setSearchRequest}/>
        {isLoadingError ? <span className="text-red-600">Произошла ошибка при загрузке полей</span> : ''}
        {isLoading || isFetching ? <CircularProgress/> : ''}
        <FieldBlockContainer fields={page.content}/>
    </div>

})


function useGetFields(
    searchRequest: SearchRequest,
    pagination: PaginationState) {
    return useQuery<Page<FieldReadDto>>({
        queryKey: [
            'fields',
            searchRequest,
            pagination.pageIndex,
            pagination.pageSize,
        ],
        queryFn: async () => {
            const response = await fieldService.search(
                searchRequest, pagination.pageIndex, pagination.pageSize, null)
            console.log(searchRequest);
            console.log(response.data);
            return response.data;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}

export default UserFieldView;