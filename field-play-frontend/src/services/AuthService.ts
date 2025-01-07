import SignInRequest from "../interfaces/auth/SignInRequest.ts";
import apiService from "./ApiService.ts";
import AuthResponse from "../interfaces/auth/AuthResponse.ts";
import {AxiosResponse} from "axios";
import SignUpRequest from "../interfaces/auth/SignUpRequest.ts";


class AuthService {
    login = async (request: SignInRequest): Promise<AxiosResponse<AuthResponse>> => {
        return apiService.post<AuthResponse>('/auth/sign-in', request);
    }

    register = async (request: SignUpRequest): Promise<AxiosResponse<AuthResponse>> => {
        return apiService.post<AuthResponse>('/auth/sign-up', request);
    }
}

const authService = new AuthService();
export default authService;