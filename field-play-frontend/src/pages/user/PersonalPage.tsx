import "./PersonalPage.css"
import UserHeader from "../../components/header/UserHeader/UserHeader.tsx";
import UserDetails from "../../components/user/UserDetails.tsx";
import {useAuth} from "../../context/UserAuth.tsx";
import UserFeedbackView from "../../components/user/UserFeedbacks/UserFeedbackView.tsx";
import UserSessionBlockContainer from "../../components/user/UserSessions/UserSessionBlockContainer.tsx";
import {Status} from "../../interfaces/session/Status.ts";
import {DateTime} from "luxon";

const PersonalPage = () => {
    const {user} = useAuth();
    return <div className="personal-page-container">
        <UserHeader/>
        <UserDetails user={user!}/>
        <UserSessionBlockContainer
            sessions={
                [
                    {
                        id: 2,
                        fieldId: 2,
                        fieldName: "Маршал Арена",
                        status: Status.ACTIVE,
                        bookingPrice: 3000,
                        signUpPrice: 500,
                        signUpCount: 15,
                        maxPlayers: 20,
                        minPlayers: 5,
                        startsAt: DateTime.fromISO('2025-09-09T14:00:00')
                    }
                ]}
        />
    </div>
}

export default PersonalPage;