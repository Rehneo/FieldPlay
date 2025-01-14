import React from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "../context/UserAuth.tsx";
import {Role} from "../interfaces/auth/Role.ts";

type Props = { children: React.ReactNode }


const ProtectedAdminRoute = ({children}: Props) => {
    const location = useLocation();
    const {isLoggedIn, user} = useAuth();

    return (isLoggedIn() && user && user.role == Role.FIELD_ADMIN) ? (<>{children}</>) : (
        <Navigate to={"/"} state={{from: location}} replace/>);
};

export default ProtectedAdminRoute;