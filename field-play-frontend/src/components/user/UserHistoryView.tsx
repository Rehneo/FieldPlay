import {useState} from "react";
import {Button} from "@mui/material";
import UserSessionView from "./UserSessions/UserSessionView.tsx";
import UserFeedbackView from "./UserFeedbacks/UserFeedbackView.tsx";
import "./UserHistoryView.css"
enum HistoryType {
    SESSIONS,
    FEEDBACKS
}

const UserHistoryView = () => {
    const [historyType, setHistoryType] = useState<HistoryType>(HistoryType.SESSIONS);

    return <>
        <div className="select-history-container">
            <Button variant={historyType == HistoryType.SESSIONS ? "contained" : "outlined"}
                    onClick={() => setHistoryType(HistoryType.SESSIONS)}
            >Записи
            </Button>
            <Button variant={historyType == HistoryType.FEEDBACKS ? "contained" : "outlined"}
                    onClick={() => setHistoryType(HistoryType.FEEDBACKS)}
            >Отзывы</Button>
        </div>
        {historyType == HistoryType.SESSIONS
            ? <UserSessionView/>
            : <UserFeedbackView/>
        }
    </>

}

export default UserHistoryView;