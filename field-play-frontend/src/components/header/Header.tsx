import {useAuth} from "../../context/UserAuth.tsx";
import UserHeader from "./UserHeader/UserHeader.tsx";
import DefaultHeader from "./DefaultHeader/DefaultHeader.tsx";

const Header = () => {
    const {isLoggedIn} = useAuth();

    return isLoggedIn() ? <UserHeader/> : <DefaultHeader/>;
}


export default Header;