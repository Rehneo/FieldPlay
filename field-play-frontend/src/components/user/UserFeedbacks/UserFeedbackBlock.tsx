import "./UserFeedbackBlock.css"
import FeedbackReadDto from "../../../interfaces/feedback/FeedbackReadDto.ts";
import React from "react";
import starIcon from '../../../assets/star.svg'
import {DateTime} from "luxon";

interface UserFeedbackBlockProps {
    feedback: FeedbackReadDto;
}

const UserFeedbackBlock: React.FC<UserFeedbackBlockProps> = ({feedback}) => {
    return <div className="user-feedback-block">
        <label className="field-name">{feedback.fieldName}</label>
        <div className="feedback-info-container">
            <img src={starIcon} className="icon" alt="Star Icon"/>
            <span>{feedback.rating}</span>
            <span className="feedback-date">{DateTime.fromISO(feedback.createdAt.toString())
                .toLocaleString(DateTime.DATE_MED)}</span>
        </div>
        <div className="feedback-message">
            {feedback.message}
        </div>
    </div>
}

export default UserFeedbackBlock;