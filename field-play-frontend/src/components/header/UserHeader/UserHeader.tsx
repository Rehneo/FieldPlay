import "../Header.css"
import {Avatar} from "@mui/material";
import cityIcon from '../../../assets/city.svg'
import footballIcon from '../../../assets/football.svg'
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../context/UserAuth.tsx";

const UserHeader = () => {
    const navigate = useNavigate();
    const {user} = useAuth();

    return <header className="header">
        <div className="user-container">
            <Avatar onClick={() => navigate("/me")}
                    className="avatar"
                    alt="User"
                    sx={{width: 50, height: 50}}/>
            <span>{user?.balance} р.</span>
        </div>
        <div className="logo-container" onClick={() => navigate("/fields")}>
            <img src={footballIcon} className="icon" alt="Football Icon"/>
            <span>Field Play</span>
        </div>
        <div className="city-container">
            <span>Санкт-Петербург</span>
            <img src={cityIcon} className="icon" alt="City Icon"/>
        </div>
    </header>
}

export default UserHeader;