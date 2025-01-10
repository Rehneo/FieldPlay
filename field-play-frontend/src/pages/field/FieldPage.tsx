import {useParams} from "react-router-dom";
import Header from "../../components/header/Header.tsx";
import "./FieldPage.css"
import FieldDetailsController from "../../components/field/FieldDetails/FieldDetailsController.tsx";
import {useAuth} from "../../context/UserAuth.tsx";
import {DateTime} from "luxon";
import FeedbackBlockContainer from "../../components/feedback/FeedbackBlockContainer.tsx";


const FieldPage = () => {
    const {fieldId} = useParams();
    const {user} = useAuth();
    return <div className="field-page-container">
        <Header/>
        <FieldDetailsController fieldId={fieldId!}/>
        <FeedbackBlockContainer feedbacks={[{
            id: 2,
            user: user!,
            fieldId: 2,
            fieldName: 'd',
            rating: 5,
            message: "Отличное поле, понравилось",
            createdAt: DateTime.now()
        }]}/>
    </div>
}

export default FieldPage;