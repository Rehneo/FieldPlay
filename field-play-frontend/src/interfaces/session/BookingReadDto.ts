import User from "../auth/User.ts";
import {Session} from "react-router-dom";
import {DateTime} from "luxon";

export default interface BookingReadDto {
    id: number;
    user: User;
    session: Session;
    createdAt: DateTime;
}