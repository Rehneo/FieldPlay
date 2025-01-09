import User from "../../interfaces/auth/User.ts";
import React from "react";
import "./UserDetails.css"
import {Role} from "../../interfaces/auth/Role.ts";

interface UserDetailsProps {
    user: User;
}

const UserDetails: React.FC<UserDetailsProps> = ({user}) => {

    return <div className="user-details-container">
        <label className="personal-label">Личный кабинет</label>
        <hr className="personal-line"/>
        <label className="role-label">{user.role == Role.USER ? "Пользователь" : "Админ"}</label>
        <div className="user-info-container">
            <div className="photo-container">
                <label className="photo-label">Фото?</label>
            </div>
            <div className="info-container">
                <label className="id-label">ID: {user.id}</label>
                <hr className="personal-line"/>
                <label className="full-name-label">{user.firstName} {user.lastName}</label>
            </div>

        </div>
    </div>
}

export default UserDetails;