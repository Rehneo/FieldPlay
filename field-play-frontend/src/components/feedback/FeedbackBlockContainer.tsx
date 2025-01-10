import FeedbackReadDto from "../../interfaces/feedback/FeedbackReadDto.ts";
import React from "react";
import FeedbackBlock from "./FeedbackBlock.tsx";
import "./FeedbackBlockContainer.css"

interface FeedbackBlockContainerProps {
    feedbacks: FeedbackReadDto[];
}

const FeedbackBlockContainer: React.FC<FeedbackBlockContainerProps> = ({feedbacks}) => {
    return <div className="feedback-container">
        {feedbacks.map((feedback) => {
            return <FeedbackBlock key={feedback.id} feedback={feedback}/>
        })}
    </div>
}

export default FeedbackBlockContainer;