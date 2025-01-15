import React, {useContext, useState} from "react";
import SearchRequest from "../../../interfaces/search/SearchRequest.ts";
import FieldFilter from "../FieldFilter/FieldFilter.tsx";
import FieldBlockContainer from "../FieldBlockContainer/FieldBlockContainer.tsx";
import FieldReadDto from "../../../interfaces/field/FieldReadDto.ts";
import "./FieldView.css"
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import Page from "../../../interfaces/Page.ts";
import fieldService from "../../../services/FieldService.ts";
import {CircularProgress, Pagination} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {FIELD_PAGE_SIZE} from "../../../config/constants.tsx";
import CityContext from "../../../context/CityProvider.tsx";
import City from "../../../interfaces/location/City.ts";
import {SearchOperator} from "../../../interfaces/search/SearchOperator.ts";

const UserFieldView = (() => {
    const navigate = useNavigate();
    const [searchRequest, setSearchRequest] = useState<SearchRequest>({criteriaList: []})
    const [pageIndex, setPageIndex] = useState<number>(1);
    const {city} = useContext(CityContext);

    const onNavigate = (fieldId: number) => {
        navigate(`/fields/${fieldId}`);
    };

    const handlePageIndexChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };

    const {
        data: page = {content: [], totalElements: 0},
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetFields(searchRequest, pageIndex, city!);

    return <div className="field-view-container">
        <span className="field-select-label">Выберите поле</span>
        <FieldFilter onApply={setSearchRequest}/>
        {isLoading || isFetching ? <CircularProgress/> : page.content.length === 0
            ? isLoadingError
                ? <span className="text-red-600">Произошла ошибка при загрузке полей</span>
                : <span>Ничего не найдено</span>
            : ''
        }
        <FieldBlockContainer fields={page.content} onNavigate={onNavigate}/>
        <Pagination className="pagination" count={Math.ceil(page.totalElements / FIELD_PAGE_SIZE)}
                    page={pageIndex}
                    onChange={handlePageIndexChange}/>
    </div>

})

function useGetFields(
    searchRequest: SearchRequest,
    pageIndex: number,
    city: City
) {
    return useQuery<Page<FieldReadDto>>({
        queryKey: [
            'fields',
            searchRequest,
            pageIndex,
            city
        ],
        queryFn: async () => {
            const search = {
                criteriaList: [
                    ...(searchRequest.criteriaList || []),
                    {
                        key: 'cityId',
                        value: city.id,
                        operator: SearchOperator.NESTED_CITY_ID,
                    },
                ],
            };
            const response = await fieldService.search(
                search, pageIndex - 1, FIELD_PAGE_SIZE, null)
            return response.data;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}

export default UserFieldView;