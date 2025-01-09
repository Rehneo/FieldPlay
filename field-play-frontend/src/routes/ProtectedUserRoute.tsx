import React from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "../context/UserAuth.tsx";

type Props = { children: React.ReactNode }


const ProtectedUserRoute = ({children}: Props) => {
    const location = useLocation();
    const {isLoggedIn} = useAuth();

    return (isLoggedIn()) ? (<>{children}</>) : (<Navigate to={"/sign-up"} state={{from: location}} replace/>);
};

export default ProtectedUserRoute;