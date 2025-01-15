import "./AdminFieldController.css"
import {keepPreviousData, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Page from "../../../interfaces/Page.ts";
import FieldReadDto from "../../../interfaces/field/FieldReadDto.ts";
import fieldService from "../../../services/FieldService.ts";
import {PAGE_SIZE, UNHANDLED_ERROR_MESSAGE} from "../../../config/constants.tsx";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, CircularProgress, Pagination} from "@mui/material";
import FieldBlockContainer from "../../field/FieldBlockContainer/FieldBlockContainer.tsx";
import FieldCreateEditDto from "../../../interfaces/field/FieldCreateEditDto.ts";
import {toast} from "react-toastify";
import FieldCreateEditForm from "../FieldCreateEditForm/FieldCreateEditForm.tsx";

const AdminFieldController = ({companyId}: { companyId: number }) => {
    const navigate = useNavigate();
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const onNavigate = (fieldId: number) => {
        navigate(`/companies/${companyId}/fields/${fieldId}`);
    };

    const onCreateForm = async (field: FieldCreateEditDto) => {
        try {
            await createField(field);
            toast.success("Футбольное поле было успешно добавлено");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }

    const handlePageIndexChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };

    const {
        data: page = {content: [], totalElements: 0},
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetFields(companyId, pageIndex);

    const {mutateAsync: createField, isPending: isCreatePending} = useCreateField();

    return <div className="admin-field-controller-container">
        <span className="admin-field-select-label">Поля</span>
        {isLoading || isFetching || isCreatePending ? <CircularProgress/> : page.content.length === 0
            ? isLoadingError
                ? <span className="text-red-600">Произошла ошибка при загрузке полей</span>
                : <span>Ничего не найдено</span>
            : ''
        }
        <FieldBlockContainer fields={page.content} onNavigate={onNavigate}/>
        <Pagination className="pagination" count={Math.ceil(page.totalElements / PAGE_SIZE)}
                    page={pageIndex}
                    onChange={handlePageIndexChange}/>
        <Button variant="contained" sx={{width: 200}} onClick={() => setOpenForm(true)}>Добавить поле</Button>
        <FieldCreateEditForm onSubmit={onCreateForm}
                             open={openForm}
                             onClose={() => setOpenForm(false)}
                             companyId={companyId}
        />
    </div>
}

export default AdminFieldController;


function useGetFields(companyId: number, pageIndex: number) {
    return useQuery<Page<FieldReadDto>>({
        queryKey: [
            'admin-fields',
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

function useCreateField() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (field: FieldCreateEditDto) => {
            const response = await fieldService.create(field);
            return response.data;
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ['admin-fields']}),
    });
}
