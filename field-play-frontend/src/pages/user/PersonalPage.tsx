import "./PersonalPage.css"
import UserHeader from "../../components/header/UserHeader/UserHeader.tsx";
import UserDetails from "../../components/user/UserDetails.tsx";
import {useAuth} from "../../context/UserAuth.tsx";
import UserFeedbackBlockContainer from "../../components/user/UserFeedbacks/UserFeedbackBlockContainer.tsx";
import {DateTime} from "luxon";

const PersonalPage = () => {
    const {user} = useAuth();
    return <div className="personal-page-container">
        <UserHeader/>
        <UserDetails user={user!}/>
        <UserFeedbackBlockContainer feedbacks={[
            {
                id: 1,
                user: user!,
                fieldName: 'Маршал Арена',
                fieldId: 2,
                message: 'Отличное поле, понравилось',
                rating: 5,
                createdAt: DateTime.now()
            }, {
                id: 1,
                user: user!,
                fieldName: 'Маршал Арена',
                fieldId: 2,
                message: 'Отличное поле, понравилось',
                rating: 5,
                createdAt: DateTime.now()
            }]}/>
    </div>
}

export default PersonalPage;