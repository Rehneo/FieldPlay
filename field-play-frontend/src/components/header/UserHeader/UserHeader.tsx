import "../Header.css"
import "./UserHeader.css"
import {Avatar, Collapse, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import cityIcon from '../../../assets/city.svg'
import footballIcon from '../../../assets/football.svg'
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../context/UserAuth.tsx";
import {useEffect, useRef, useState} from "react";
import {Role} from "../../../interfaces/auth/Role.ts";

const UserHeader = () => {
    const navigate = useNavigate();
    const {user, logout} = useAuth();
    const [open, setOpen] = useState(false);

    const collapseRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                collapseRef.current &&
                !collapseRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return <div>
        <header className="header">
            <div className="user-container" ref={buttonRef}>
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
        <Collapse ref={collapseRef} className="user-list" in={open} timeout="auto" unmountOnExit>
            <List>
                {
                    user?.role == Role.FIELD_ADMIN
                        ? <ListItem disablePadding>
                            <ListItemButton onClick={() => {
                                navigate("/admin")
                            }}>
                                <ListItemText primary="Админ панель"/>
                            </ListItemButton>
                        </ListItem>
                        : ''
                }
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate("/me")
                    }}>
                        <ListItemText primary="Личный Кабинет"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate("/me/balance")
                    }}>
                        <ListItemText primary="Пополнить баланс"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate("/me/admin-requests")
                    }}>
                        <ListItemText primary="Стать админом поля"/>
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