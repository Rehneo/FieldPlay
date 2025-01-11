import NotFoundPage from "../pages/NotFoundPage.tsx";
import {useParams} from "react-router-dom";
import React from "react";


type Props = { children: React.ReactNode };

const IdRouteGuard = ({children}: Props) => {
    const {fieldId} = useParams();

    const isValidFieldId = /^[1-9]\d*$/.test(fieldId!);

    if (!isValidFieldId) {
        return <NotFoundPage/>;
    }

    return children;
}

export default IdRouteGuard;