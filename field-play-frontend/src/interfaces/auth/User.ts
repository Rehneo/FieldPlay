import {Role} from "./Role.ts";

export default interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    role: Role;
    balance: number;
    birthDate: Date;
}