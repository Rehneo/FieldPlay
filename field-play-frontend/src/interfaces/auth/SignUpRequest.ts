import {DateTime} from "luxon";

export default interface SignUpRequest {
    firstName: string;
    lastName: string;
    birthDate: DateTime;
    username: string;
    password: string;
}