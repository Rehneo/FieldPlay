import {SessionMap} from "../../components/session/SessionTableController/SessionTableController.tsx";
import SessionCreateEditDto from "./SessionCreateEditDto.ts";
import {DateTime} from "luxon";

export default interface SessionMapCreate {
    week: SessionMap[];
    session: SessionCreateEditDto;
    startTime: DateTime;
}