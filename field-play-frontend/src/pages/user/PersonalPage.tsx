
import "./PersonalPage.css"
import UserHeader from "../../components/header/UserHeader/UserHeader.tsx";
import UserDetails from "../../components/user/UserDetails.tsx";
import {useAuth} from "../../context/UserAuth.tsx";

const PersonalPage = () => {
    const {user} = useAuth();
    return <div className="personal-page-container">
        <UserHeader/>
        <UserDetails user={user!}/>
    </div>
}

export default PersonalPage;