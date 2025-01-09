import "../Header.css"
import "./UserHeader.css"
import {Avatar, Collapse, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import cityIcon from '../../../assets/city.svg'
import footballIcon from '../../../assets/football.svg'
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../context/UserAuth.tsx";
import {useState} from "react";

const UserHeader = () => {
    const navigate = useNavigate();
    const {user, logout} = useAuth();
    const [open, setOpen] = useState(false);

    return <div>
        <header className="header">
            <div className="user-container">
                <Avatar onClick={() => setOpen(!open)}
                        className="avatar"
                        alt="User"
                        sx={{width: 50, height: 50}}/>
                <span>{user?.balance} р.</span>
            </div>
            <div className="logo-container" onClick={() => navigate("/")}>
                <img src={footballIcon} className="icon" alt="Football Icon"/>
                <span>Field Play</span>
            </div>
            <div className="city-container">
                <span>Санкт-Петербург</span>
                <img src={cityIcon} className="icon" alt="City Icon"/>
            </div>
        </header>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List className="user-list">
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate("/me")
                    }}>
                        <ListItemText primary="Личный Кабинет"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        logout()
                    }}>
                        <ListItemText primary="Выйти"/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Collapse>
    </div>
}

export default UserHeader;