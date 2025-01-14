import "./AdminFieldController.css"
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import Page from "../../../interfaces/Page.ts";
import FieldReadDto from "../../../interfaces/field/FieldReadDto.ts";
import fieldService from "../../../services/FieldService.ts";
import {PAGE_SIZE} from "../../../config/constants.tsx";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {CircularProgress, Pagination} from "@mui/material";
import FieldBlockContainer from "../../field/FieldBlockContainer/FieldBlockContainer.tsx";

const AdminFieldController = ({companyId}: { companyId: number }) => {
    const navigate = useNavigate();
    const [pageIndex, setPageIndex] = useState<number>(1);
    const onNavigate = (fieldId: number) => {
        navigate(`/companies/${companyId}/fields/${fieldId}`);
    };

    const handlePageIndexChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };

    const {
        data: page = {content: [], totalElements: 0},
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetFields(companyId, pageIndex);

    return <div className="admin-field-controller-container">
        <span className="admin-field-select-label">Поля</span>
        {isLoading || isFetching ? <CircularProgress/> : page.content.length === 0
            ? isLoadingError
                ? <span className="text-red-600">Произошла ошибка при загрузке полей</span>
                : <span>Ничего не найдено</span>
            : ''
        }
        <FieldBlockContainer fields={page.content} onNavigate={onNavigate}/>
        <Pagination className="pagination" count={Math.ceil(page.totalElements / PAGE_SIZE)}
                    page={pageIndex}
                    onChange={handlePageIndexChange}/>
    </div>
}

export default AdminFieldController;


function useGetFields(companyId: number, pageIndex: number) {
    return useQuery<Page<FieldReadDto>>({
        queryKey: [
            'fields',
            companyId,
            pageIndex
        ],
        queryFn: async () => {
            const response = await fieldService.getAllByCompany(
                companyId,
                pageIndex - 1,
                PAGE_SIZE
            )
            return response.data;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}