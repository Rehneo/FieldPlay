import React from "react";
import {useAuth} from "../context/UserAuth.tsx";
import {Role} from "../interfaces/auth/Role.ts";
import AccessDeniedPage from "../pages/AccessDeniedPage.tsx";

type Props = { children: React.ReactNode }

const ProtectedAdminRoute = ({children}: Props) => {
    const {isLoggedIn, user} = useAuth();
    return (isLoggedIn() && user && user.role == Role.FIELD_ADMIN) ? (<>{children}</>) : (
        <AccessDeniedPage/>);
};

export default ProtectedAdminRoute;