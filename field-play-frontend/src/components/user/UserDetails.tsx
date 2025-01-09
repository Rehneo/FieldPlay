import User from "../../interfaces/auth/User.ts";
import React from "react";
import "./UserDetails.css"

interface UserDetailsProps {
    user: User;
}

const UserDetails:  React.FC<UserDetailsProps>  = ({user}) => {

    return <div className="user-details-container">

    </div>
}

export default UserDetails;