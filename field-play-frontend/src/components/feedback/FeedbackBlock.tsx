import FeedbackReadDto from "../../interfaces/feedback/FeedbackReadDto.ts";
import React from "react";
import "./FeedbackBlock.css"
import {Avatar} from "@mui/material";
import starIcon from "../../assets/star.svg";
import {DateTime} from "luxon";

interface FeedbackBlockProps {
    feedback: FeedbackReadDto;
}

const FeedbackBlock: React.FC<FeedbackBlockProps> = ({feedback}) => {
    return <div className="feedback-block">
        <div className="feedback-user-container">
            <Avatar className="avatar"
                    alt="User"
                    sx={{width: 40, height: 40}}/>
            <span>{feedback.user.firstName} {feedback.user.lastName}</span>
        </div>
        <div className="feedback-info-container">
            <img src={starIcon} className="w-4" alt="Star Icon"/>
            <span>{feedback.rating}</span>
            <span className="feedback-date">{DateTime.fromISO(feedback.createdAt.toString())
                .toLocaleString(DateTime.DATE_MED)}</span>
        </div>
        <div className="feedback-message">
            {feedback.message}
        </div>
    </div>
}

export default FeedbackBlock;