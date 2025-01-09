import "./PersonalPage.css"
import UserDetails from "../../components/user/UserDetails.tsx";
import {useAuth} from "../../context/UserAuth.tsx";
import UserHistoryView from "../../components/user/UserHistoryView.tsx";
import Header from "../../components/header/Header.tsx";

const PersonalPage = () => {
    const {user} = useAuth();
    return <div className="personal-page-container">
        <Header/>
        <UserDetails user={user!}/>
        <UserHistoryView/>
    </div>
}

export default PersonalPage;