import "../Header.css"
import "./UserHeader.css"
import {
    Avatar,
    Collapse,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText, MenuItem,
    Select, SelectChangeEvent
} from "@mui/material";
import cityIcon from '../../../assets/city.svg'
import footballIcon from '../../../assets/football.svg'
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../context/UserAuth.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {Role} from "../../../interfaces/auth/Role.ts";
import CityContext from "../../../context/CityProvider.tsx";
import City from "../../../interfaces/location/City.ts";

const UserHeader = () => {
    const navigate = useNavigate();
    const {user, logout} = useAuth();
    const [open, setOpen] = useState(false);
    const {cities, setCity, city} = useContext(CityContext);

    const collapseRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLDivElement | null>(null);

    const handleCityChange = async (event: SelectChangeEvent<number>) => {
        const selectedCity = cities.find(
            (c: City) => c.id == (event.target.value)
        );
        setCity(selectedCity!);
    };

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
                <FormControl sx={{width: 400}}>
                    <InputLabel>Город</InputLabel>
                    <Select
                        name="type"
                        variant="standard"
                        value={city!.id}
                        onChange={handleCityChange}
                        required
                    >
                        {cities.map((c) => {
                            return <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
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