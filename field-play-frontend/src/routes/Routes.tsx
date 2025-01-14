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
import BalancePage from "../pages/user/BalancePage.tsx";
import UserAdminRequestPage from "../pages/user/UserAdminRequestPage.tsx";
import ProtectedAdminRoute from "./ProtectedAdminRoute.tsx";
import AdminPage from "../pages/admin/AdminPage.tsx";

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
            {path: "/fields/:fieldId", element: <IdRouteGuard><FieldPage/></IdRouteGuard>},
            {path: "/me/balance", element: <ProtectedUserRoute children={<BalancePage/>}/>},
            {
                path: "/me/admin-requests", element: <ProtectedUserRoute children={<UserAdminRequestPage/>}/>
            },
            {path: "/admin", element: <ProtectedAdminRoute children={<AdminPage/>}/>}
        ]
    }
])