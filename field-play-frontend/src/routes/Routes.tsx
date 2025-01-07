import {createBrowserRouter} from "react-router-dom";
import SignInPage from "../pages/auth/SignInPage.tsx";
import App from "../App.tsx";
import SignUpPage from "../pages/auth/SignUpPage.tsx";

export const router = createBrowserRouter([

    {
        path: '/',
        element: <App/>,
        children: [
            {path: "sign-in", element: <SignInPage/>},
            {path: "sign-up", element: <SignUpPage/>}
        ]
    }
])