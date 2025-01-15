import "./ErrorPage.css"
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {UNHANDLED_ERROR_MESSAGE} from "../config/constants.tsx";

const ServerErrorPage = () => {
    const navigate = useNavigate();
    return <div className="error-page">
        <div className="error-container">
            <label className="error-label">500 {UNHANDLED_ERROR_MESSAGE}</label>
            <Button onClick={(() => {
                navigate("/")
            })}>Домой</Button>
        </div>
    </div>
}

export default ServerErrorPage;