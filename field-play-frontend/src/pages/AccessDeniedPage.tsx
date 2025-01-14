import {Button} from "@mui/material";
import "./ErrorPage.css"
import {useNavigate} from "react-router-dom";

const AccessDeniedPage = () => {
    const navigate = useNavigate();
    return <div className="error-page">
        <div className="error-container">
            <label className="error-label">403 Доступ запрещен</label>
            <Button onClick={(() => {
                navigate("/")
            })}>Домой</Button>
        </div>
    </div>
}

export default AccessDeniedPage;