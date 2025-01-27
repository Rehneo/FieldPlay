import "./ErrorPage.css"
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();
    return <div className="error-page">
        <div className="error-container">
            <label className="error-label">404 Ресурс не найден</label>
            <Button onClick={(() => {
                navigate("/")
            })}>Домой</Button>
        </div>
    </div>
}

export default NotFoundPage;