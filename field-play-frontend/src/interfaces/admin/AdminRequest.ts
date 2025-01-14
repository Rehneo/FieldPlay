import User from "../auth/User.ts";
import Company from "../company/Company.ts";
import {DateTime} from "luxon";
import {AdminRequestStatus} from "./AdminRequestStatus.ts";

export default interface AdminRequest {
    id: number;
    user: User;
    company: Company;
    createdAt: DateTime;
    status: AdminRequestStatus;
    approvedBy: User;
    approvedAt: DateTime;
}