import {DateTime} from "luxon";

export default interface SessionCreateDto {
    fieldId: number;
    bookingPrice: number;
    signUpPrice: number;
    minPlayers: number;
    startsAt: DateTime;
}