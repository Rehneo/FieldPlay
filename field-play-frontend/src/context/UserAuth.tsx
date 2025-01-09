import User from "../interfaces/auth/User.ts";
import SignUpRequest from "../interfaces/auth/SignUpRequest.ts";
import SignInRequest from "../interfaces/auth/SignInRequest.ts";
import {useNavigate} from "react-router-dom";
import React, {createContext, useEffect, useState} from "react";
import authService from "../services/AuthService.ts";

type UserContextType = {
    user: User | null;
    authErrorMessage: string | null;
    token: string | null;
    signUp: (credentials: SignUpRequest) => void;
    signIn: (credentials: SignInRequest) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const AuthProvider = ({children}: Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [IsReady, setIsReady] = useState(false);
    const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (user && token) {
            setUser(JSON.parse(user));
            setToken(token);
        }
        setIsReady(true);
    }, []);

    const signUp = async (credentials: SignUpRequest) => {
        await authService.register(credentials).then((res) => {
            if (res) {
                localStorage.setItem("token", res?.data.token);
                localStorage.setItem("user", JSON.stringify(res?.data.user));
                setToken(res?.data.token);
                setUser(res?.data.user);
                navigate("/");
            }
        }).catch(error => {
            if (error.response && error.response.status === 409) {
                setAuthErrorMessage("Пользователь с таким логином уже существует");
            } else {
                setAuthErrorMessage("Что-то пошло не так... попробуйте позднее");
            }
        })
    };

    const signIn = async (credentials: SignInRequest) => {
        await authService.login(credentials).then((res) => {
            if (res) {
                localStorage.setItem("token", res?.data.token);
                localStorage.setItem("user", JSON.stringify(res?.data.user));
                setToken(res?.data.token);
                setUser(res?.data.user);
                navigate("/");
            }
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                setAuthErrorMessage("Неверный логин или пароль");
            } else {
                setAuthErrorMessage("Что-то пошло не так... попробуйте позднее")
            }
        })
    };


    const isLoggedIn = () => {
        return !!user;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);

        navigate("/sign-in");
    };

    return (
        <UserContext.Provider value={{signIn, user, token, logout, isLoggedIn, signUp, authErrorMessage}}>
            {IsReady ? children : null}
        </UserContext.Provider>
    )
}


export const useAuth = () => React.useContext(UserContext);

