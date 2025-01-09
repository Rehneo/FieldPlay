import "./UserFeedbackBlockContainer.css"
import FeedbackReadDto from "../../../interfaces/feedback/FeedbackReadDto.ts";
import React from "react";
import UserFeedbackBlock from "./UserFeedbackBlock.tsx";

interface UserFeedbackBlockContainerProps {
    feedbacks: FeedbackReadDto[];
}

const UserFeedbackBlockContainer: React.FC<UserFeedbackBlockContainerProps> = ({feedbacks}) => {
    return <div className="user-feedback-container">
        {feedbacks.map((feedback) => {
            return <UserFeedbackBlock key={feedback.id} feedback={feedback}/>
        })}
    </div>
}

export default UserFeedbackBlockContainer;