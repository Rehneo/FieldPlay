import Header from "../../components/header/Header.tsx";
import "./UserAdminRequestPage.css"
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import Page from "../../interfaces/Page.ts";
import Company from "../../interfaces/company/Company.ts";
import companyService from "../../services/CompanyService.ts";
import {Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {useState} from "react";
import {AdminRequestStatus} from "../../interfaces/admin/AdminRequestStatus.ts";
import {toast, ToastContainer} from "react-toastify";
import {UNHANDLED_ERROR_MESSAGE} from "../../config/constants.tsx";

const StatusMessage = ({status}: { status: AdminRequestStatus }) => {
    switch (status) {
        case AdminRequestStatus.APPROVED:
            return <span className="text-green-700 font-bold">Ваша заявка одобрена</span>
        case AdminRequestStatus.REJECTED:
            return <span className="text-red-600 font-bold">Ваша заявка отклонена</span>
        case AdminRequestStatus.PENDING:
            return <span
                className="text-green-700 font-bold">Ваша зявка находится в рассмотрении у администраторов</span>
        default:
            return '';
    }
}

const UserAdminRequestPage = () => {
    const [company, setCompany] = useState<Company | undefined>(undefined);
    const [requestStatus, setRequestStatus] = useState<AdminRequestStatus | undefined>(undefined);

    const {
        data: page = {content: [], totalElements: 0},
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetCompanies();

    const getAdminRequest = async (companyId: number) => {
        try {
            const response = await companyService.getMyByCompany(companyId);
            setRequestStatus(response.data.status);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }

    const handleChange = async (event: SelectChangeEvent<number>) => {
        const selectedCompany = page.content.find(
            (c: Company) => c.id == (event.target.value)
        );
        setCompany(selectedCompany);
        await getAdminRequest(Number(event.target.value));
    };

    const handleCreate = async () => {
        try {
            await companyService.createAdminRequest(company!.id);
            await getAdminRequest(company!.id);
            toast.success("Ваша заявка успешно отправлена");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error(UNHANDLED_ERROR_MESSAGE);
        }
    }

    return <>
        <Header/>
        <div className="send-admin-request-container">
            <label>Стать администратором поля</label>
            {isLoading || isFetching ?
                <CircularProgress/> : isLoadingError ? 'Произошла ошибка при загрузке компаний' : ''}
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Выберите компанию</InputLabel>
                <Select
                    value={company?.id || ''}
                    onChange={handleChange}
                    variant='standard'
                    label="Select Company"
                    disabled={isLoading || isFetching || isLoadingError}
                >
                    {page.content.map((c: Company) => (
                        <MenuItem key={c.id} value={c.id}>
                            {c.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {requestStatus
                ? requestStatus == AdminRequestStatus.DOES_NOT_EXIST
                    ? <Button variant='contained' onClick={handleCreate}>Отправить заявку</Button>
                    : <StatusMessage status={requestStatus}></StatusMessage>
                : ''
            }
            <ToastContainer/>
        </div>
    </>
}

export default UserAdminRequestPage;


function useGetCompanies() {
    return useQuery<Page<Company>>({
        queryKey: [
            'companies',
        ],
        queryFn: async () => {
            const response = await companyService.getAll();
            return response.data;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}