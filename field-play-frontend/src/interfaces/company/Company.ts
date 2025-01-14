import User from "../auth/User.ts";

export default interface Company {
    id: number;
    name: string;
    balance: number;
    numberOfFields: number;
    owner?: User;
}