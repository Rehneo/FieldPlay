import {keepPreviousData, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Page from "../../../interfaces/Page.ts";
import companyService from "../../../services/CompanyService.ts";
import {PAGE_SIZE, UNHANDLED_ERROR_MESSAGE} from "../../../config/constants.tsx";
import BlackListReadDto from "../../../interfaces/admin/BlackListReadDto.ts";
import BlackListCreateDto from "../../../interfaces/admin/BlackListCreateDto.ts";
import React, {useState} from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Pagination,
    TextField
} from "@mui/material";
import BlackListBlockContainer from "./BlackListBlockContainer.tsx";
import {toast, ToastContainer} from "react-toastify";
import {AxiosError} from "axios";

const BlackListController = ({companyId}: { companyId: number }) => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [formError, setFormError] = useState("");
    const [formIdError, setFormIdError] = useState("");
    const [userId, setUserId] = useState("");
    const [reason, setReason] = useState("");

    const handlePageIndexChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };

    const onDelete = async (blacklistId: number) => {
        try {
            await deleteBlackList(blacklistId);
            toast.success("Пользователь успешно удален из черного списка");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }

    const handleFormClose = () => {
        setOpenForm(false);
        setFormError("");
        setUserId("");
        setFormIdError("");
        setReason("");
    };

    const handleSubmit = async () => {
        const isValidUserId = /^[1-9]\d*$/.test(userId);
        if (!isValidUserId) setFormIdError("ID пользователя должно быть целым числом");
        if (!reason.trim()) {
            setFormError("Пожалуйста, введите причину");
            return;
        }
        if (reason.length < 4) {
            setFormError("Пожалуйста, введите нормальную причину");
            return;
        }
        if (!isValidUserId) return;
        try {
            await createBlackList(
                {
                    companyId: companyId,
                    reason: reason,
                    userId: Number(userId)
                })
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 409) {
                    setFormError("Данный пользователь уже находится в черном списке данной компании");
                    return;
                }
                if (error.status === 404) {
                    setFormError("Пользователя с id: " + userId + " не существует");
                    return;
                }
            }
            setFormError(UNHANDLED_ERROR_MESSAGE);
            return;
        }
        setFormError("");
        setFormIdError("");
        handleFormClose();
    };


    const {
        data: page = {content: [], totalElements: 0},
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetBlackLists(companyId, pageIndex);

    const {mutateAsync: createBlackList, isPending: isCreatePending} = useCreateBlackList();
    const {mutateAsync: deleteBlackList, isPending: isDeletePending} = useDeleteBlackList();

    return <div className="m-auto flex flex-col gap-4">
        <span className="blacklist-label">Черный список</span>
        {isLoading || isFetching || isDeletePending ?
            <CircularProgress/> : page.content.length === 0
                ? isLoadingError
                    ? <span className="text-red-600">Произошла ошибка при загрузке черного списка</span>
                    : 'Тут пока нет пользователей'
                : ''}
        <BlackListBlockContainer blacklists={page.content} onDelete={onDelete}/>
        <Button onClick={() => setOpenForm(true)} sx={{width: 200}} variant="contained">Добавить</Button>
        <Pagination className="pagination"
                    count={Math.ceil(page.totalElements / PAGE_SIZE)}
                    page={pageIndex}
                    onChange={handlePageIndexChange}/>
        <ToastContainer/>
        <Dialog open={openForm} onClose={handleFormClose}>
            <DialogTitle>Добавить пользователя в черный список</DialogTitle>
            <DialogContent className="flex flex-col">
                <TextField
                    label="Введите ID пользователя..."
                    value={userId}
                    type="number"
                    variant="standard"
                    error={!!formIdError}
                    helperText={formIdError}
                    slotProps={{input: {inputProps: {maxLength: 5}}}}
                    sx={{marginBottom: 2, width: "100%"}}
                    onChange={(e) => {
                        setUserId(e.target.value);
                    }}
                />
                <TextField
                    sx={{width: 400}}
                    multiline
                    rows={4}
                    margin="dense"
                    label="Введите причину..."
                    variant="outlined"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    error={!!formError}
                    helperText={formError}
                />
            </DialogContent>
            {isCreatePending ? <CircularProgress className="m-auto"/> : ''}
            <DialogActions>
                <Button onClick={handleFormClose} color="secondary">
                    Отмена
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Добавить
                </Button>
            </DialogActions>
        </Dialog>
    </div>

}

export default BlackListController;

function useGetBlackLists(companyId: number, pageIndex: number) {
    return useQuery<Page<BlackListReadDto>>({
        queryKey: [
            'blacklists',
            companyId,
            pageIndex
        ],
        queryFn: async () => {
            const response = await companyService.getAllBlackListsByCompany(
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

function useCreateBlackList() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (blacklist: BlackListCreateDto) => {
            const response = await companyService.createBlackList(blacklist);
            return response.data;
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ['blacklists']}),
    });
}

function useDeleteBlackList() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (blacklistId: number) => {
            return await companyService.deleteBlackList(blacklistId);
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ['blacklists']}),
    });
}

