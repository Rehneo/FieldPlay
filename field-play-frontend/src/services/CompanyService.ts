import Company from "../interfaces/company/Company.ts";
import Page from "../interfaces/Page.ts";
import {AxiosResponse} from "axios";
import apiService from "./ApiService.ts";
import AdminRequest from "../interfaces/admin/AdminRequest.ts";

class CompanyService {
    getAll = async (): Promise<AxiosResponse<Page<Company>>> => {
        return apiService.get<Page<Company>>('/companies');
    }

    createAdminRequest = async (companyId: number): Promise<AxiosResponse<AdminRequest>> => {
        return apiService.post<AdminRequest>(`/field-admin-requests?companyId=${companyId}`);
    }

    getMyByCompany = async (companyId: number): Promise<AxiosResponse<AdminRequest>> => {
        return apiService.get<AdminRequest>(`/field-admin-requests/my?companyId=${companyId}`);
    }

    getAllMy = async (): Promise<AxiosResponse<Page<Company>>> => {
        return apiService.get<Page<Company>>('/companies/my');
    }

}

const companyService = new CompanyService();
export default companyService;