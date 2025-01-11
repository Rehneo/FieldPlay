import {createBrowserRouter} from "react-router-dom";
import SignInPage from "../pages/auth/SignInPage.tsx";
import App from "../App.tsx";
import SignUpPage from "../pages/auth/SignUpPage.tsx";
import FieldSelectionPage from "../pages/field/FieldSelectionPage.tsx";
import PersonalPage from "../pages/user/PersonalPage.tsx";
import ProtectedUserRoute from "./ProtectedUserRoute.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import FieldPage from "../pages/field/FieldPage.tsx";
import IdRouteGuard from "./IdRouteGuard.tsx";

export const router = createBrowserRouter([

    {
        path: '/',
        element: <App/>,
        errorElement: <NotFoundPage/>,
        children: [
            {path: "sign-in", element: <SignInPage/>},
            {path: "sign-up", element: <SignUpPage/>},
            {path: "/", element: <FieldSelectionPage/>},
            {path: "me", element: <ProtectedUserRoute children={<PersonalPage/>}/>},
            {path: "/fields/:fieldId", element: <IdRouteGuard><FieldPage/></IdRouteGuard>}
        ]
    }
])