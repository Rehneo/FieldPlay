import "./NotFoundPage.css"
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();
    return <div className="not-found-page">
        <div className="not-found-container">
            <label className="four-o-four-label">404 Ресурс не найден</label>
            <Button onClick={(() => {
                navigate("/")
            })}>Домой</Button>
        </div>
    </div>
}

export default NotFoundPage;