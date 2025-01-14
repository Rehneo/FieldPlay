import "./AdminPage.css"
import Header from "../../components/header/Header.tsx";
import {useState} from "react";
import Company from "../../interfaces/company/Company.ts";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import companyService from "../../services/CompanyService.ts";
import {SelectChangeEvent} from "@mui/material";
import CompanySelect from "../../components/select/CompanySelect.tsx";
import AdminRequestController from "../../components/admin/AdminRequest/AdminRequestController.tsx";
import BlackListController from "../../components/admin/BlackList/BlackListController.tsx";
import AdminFieldController from "../../components/admin/AdminFieldController/AdminFieldController.tsx";

const AdminPage = () => {
    const [company, setCompany] = useState<Company | undefined>(undefined);

    const handleChange = async (event: SelectChangeEvent<number>) => {
        const selectedCompany = companies.find(
            (c: Company) => c.id == (event.target.value)
        );
        setCompany(selectedCompany);
    };

    const {
        data: companies = [],
        isError: isLoadingError,
        isFetching: isFetching,
        isLoading: isLoading,
    } = useGetCompanies();

    return <>
        <Header/>
        <div className="admin-page-container">
            <CompanySelect companies={companies}
                           selectedCompany={company}
                           onChange={handleChange}
                           disabled={isLoading || isFetching || isLoadingError}
            />
            {isLoadingError
                ? <span className="text-red-600">Произошла ошибка при загрузке компании</span>
                : ''
            }
            {company
                ? <>
                    <AdminFieldController companyId={company.id}/>
                    <AdminRequestController companyId={company.id}/>
                    <BlackListController companyId={company.id}/>
                </>
                : ''
            }
        </div>
    </>
}

export default AdminPage;

function useGetCompanies() {
    return useQuery<Company[]>({
        queryKey: [
            'my-companies',
        ],
        queryFn: async () => {
            const response = await companyService.getAllMy();
            return response.data.content;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}