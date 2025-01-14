import Company from "../interfaces/company/Company.ts";
import Page from "../interfaces/Page.ts";
import {AxiosResponse} from "axios";
import apiService from "./ApiService.ts";
import AdminRequest from "../interfaces/admin/AdminRequest.ts";
import {AdminRequestStatus} from "../interfaces/admin/AdminRequestStatus.ts";

class CompanyService {
    getAll = async (): Promise<AxiosResponse<Page<Company>>> => {
        return apiService.get<Page<Company>>('/companies');
    }

    createRequest = async (companyId: number): Promise<AxiosResponse<AdminRequest>> => {
        return apiService.post<AdminRequest>(`/field-admin-requests?companyId=${companyId}`);
    }

    getMyRequestByCompany = async (companyId: number): Promise<AxiosResponse<AdminRequest>> => {
        return apiService.get<AdminRequest>(`/field-admin-requests/my?companyId=${companyId}`);
    }

    getAllMy = async (): Promise<AxiosResponse<Page<Company>>> => {
        return apiService.get<Page<Company>>('/companies/my');
    }

    getAllRequestsByCompany = async (
        companyId: number, status: AdminRequestStatus, page: number, size: number
    ): Promise<AxiosResponse<Page<AdminRequest>>> => {
        switch (status) {
            case AdminRequestStatus.APPROVED:
                return apiService.get<Page<AdminRequest>>(
                    `/field-admin-requests/approved?companyId=${companyId}&page=${page}&size=${size}`
                );
            case AdminRequestStatus.REJECTED:
                return apiService.get<Page<AdminRequest>>(
                    `/field-admin-requests/rejected?companyId=${companyId}&page=${page}&size=${size}`
                );
            default:
                return apiService.get<Page<AdminRequest>>(
                    `/field-admin-requests/pending?companyId=${companyId}&page=${page}&size=${size}`
                );
        }
    }

    processRequest = async (requestId: number, approved: boolean): Promise<AxiosResponse<AdminRequest>> => {
        return apiService.patch<AdminRequest>(`/field-admin-requests/${requestId}?approved=${approved}`);
    }
}

const companyService = new CompanyService();
export default companyService;