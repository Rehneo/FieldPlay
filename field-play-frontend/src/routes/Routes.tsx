import {createBrowserRouter} from "react-router-dom";
import SignInPage from "../pages/auth/SignInPage.tsx";
import App from "../App.tsx";

export const router = createBrowserRouter([

    {
        path: '/',
        element: <App/>,
        children: [
            {path: "sign-in", element: <SignInPage/>},
        ]
    }
])