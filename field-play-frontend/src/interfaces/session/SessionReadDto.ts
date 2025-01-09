import {DateTime} from "luxon";
import {Status} from "./Status.ts";

export default interface SessionReadDto {
    id: number;
    fieldId: number;
    fieldName: string;
    bookingPrice: number;
    signUpPrice: number;
    minPlayers: number;
    maxPlayers: number;
    signUpCount: number;
    status: Status;
    startsAt: DateTime;
}