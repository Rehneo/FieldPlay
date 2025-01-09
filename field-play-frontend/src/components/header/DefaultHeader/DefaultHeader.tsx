import {useNavigate} from "react-router-dom";
import "../Header.css"
import "./DefaultHeader.css"
import footballIcon from "../../../assets/football.svg";
import cityIcon from "../../../assets/city.svg";
import {Button} from "@mui/material";

const DefaultHeader = () => {
    const navigate = useNavigate();
    return <header className="header">
        <div className="sign-container">
            <Button style={{width: 100}} size='large' variant='outlined'
                    onClick={() => navigate("/sign-in")}>
                Вход
            </Button>
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

export default DefaultHeader;