import {DateTime} from "luxon";

export default interface SessionCreateEditDto {
    id?: number;
    fieldId?: number;
    bookingPrice: string;
    signUpPrice: string;
    minPlayers: string;
    startsAt?: DateTime;
}