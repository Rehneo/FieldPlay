import React from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import fieldService from "../../../services/FieldService.ts";
import FieldFullReadDto from "../../../interfaces/field/FieldFullReadDto.ts";
import {CircularProgress} from "@mui/material";
import FieldDetails from "./FieldDetails.tsx";

interface FieldDetailsControllerProps {
    fieldId: string
}

const FieldDetailsController: React.FC<FieldDetailsControllerProps> = ({fieldId}) => {
    const {
        data: field,
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetField(fieldId);

    return <div className="flex flex-col">
        {isLoadingError ? <span className="text-red-600 m-auto">Произошла ошибка при загрузке поля</span> : ''}
        {isLoading || isFetching ? <CircularProgress className="m-auto"/> : field? <FieldDetails field={field}/> : ''}
    </div>
}

export default FieldDetailsController;

function useGetField(fieldId: string) {
    return useQuery<FieldFullReadDto>({
        queryKey: [
            'field',
        ],
        queryFn: async () => {
            const response = await fieldService.getById(fieldId);
            return response.data;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}
