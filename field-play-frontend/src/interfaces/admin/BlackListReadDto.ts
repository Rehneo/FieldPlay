import User from "../auth/User.ts";
import {DateTime} from "luxon";

export default interface BlackListReadDto {
    id: number;
    user: User;
    reason: string;
    createdAt: DateTime;
}