import "./PersonalPage.css"
import UserHeader from "../../components/header/UserHeader/UserHeader.tsx";
import UserDetails from "../../components/user/UserDetails.tsx";
import {useAuth} from "../../context/UserAuth.tsx";
import UserHistoryView from "../../components/user/UserHistoryView.tsx";

const PersonalPage = () => {
    const {user} = useAuth();
    return <div className="personal-page-container">
        <UserHeader/>
        <UserDetails user={user!}/>
        <UserHistoryView/>
    </div>
}

export default PersonalPage;