import {Role} from "./Role.ts";
import {DateTime} from "luxon";

export default interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    role: Role;
    balance: number;
    birthDate: DateTime;
}