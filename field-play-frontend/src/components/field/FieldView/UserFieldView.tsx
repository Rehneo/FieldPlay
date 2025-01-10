import React, {useState} from "react";
import SearchRequest from "../../../interfaces/search/SearchRequest.ts";
import FieldFilter from "../FieldFilter/FieldFilter.tsx";
import FieldBlockContainer from "../FieldBlockContainer/FieldBlockContainer.tsx";
import FieldReadDto from "../../../interfaces/field/FieldReadDto.ts";
import "./FieldView.css"
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import Page from "../../../interfaces/Page.ts";
import fieldService from "../../../services/FieldService.ts";
import {CircularProgress, Pagination} from "@mui/material";

const UserFieldView = (() => {

    const [searchRequest, setSearchRequest] = useState<SearchRequest>({criteriaList: []})
    const [pageIndex, setPageIndex] = useState<number>(1);

    const handlePageIndexChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };

    const {
        data: page = {content: [], totalElements: 0},
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetFields(searchRequest, pageIndex);


    return <div className="field-view-container">
        <span className="field-select-label">Выберите поле</span>
        <FieldFilter onApply={setSearchRequest}/>
        {isLoading || isFetching ? <CircularProgress/> : page.content.length === 0
            ? isLoadingError
                ? <span className="text-red-600">Произошла ошибка при загрузке полей</span>
                : <span>Ничего не найдено</span>
            : ''
        }
        <FieldBlockContainer fields={page.content}/>
        <Pagination className="pagination" count={Math.ceil(page.totalElements / 9)}
                    page={pageIndex}
                    onChange={handlePageIndexChange}/>
    </div>

})


function useGetFields(
    searchRequest: SearchRequest,
    pageIndex: number) {
    return useQuery<Page<FieldReadDto>>({
        queryKey: [
            'fields',
            searchRequest,
            pageIndex
        ],
        queryFn: async () => {
            const response = await fieldService.search(
                searchRequest, pageIndex - 1, 9, null)
            console.log(searchRequest);
            console.log(response.data);
            return response.data;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}

export default UserFieldView;