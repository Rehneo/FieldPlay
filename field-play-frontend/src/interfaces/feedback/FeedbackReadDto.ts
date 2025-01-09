import User from "../auth/User.ts";
import {DateTime} from "luxon";

export default interface FeedbackReadDto {
    id: number;
    user: User;
    fieldId: number;
    fieldName: string;
    rating: number;
    message: string;
    createdAt: DateTime;
}