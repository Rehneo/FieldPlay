import {Session} from "react-router-dom";
import User from "../auth/User.ts";
import {DateTime} from "luxon";

export default interface SignUpReadDto {
    id: number;
    user: User;
    session: Session;
    createdAt: DateTime;
}