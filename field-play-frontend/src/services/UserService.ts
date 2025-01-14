import User from "../interfaces/auth/User.ts";
import apiService from "./ApiService.ts";
import {AxiosResponse} from "axios";

class UserService {
    updateBalance = async (amount: number): Promise<AxiosResponse<User>> => {
        return apiService.patch<User>(`/users/me/balance`, {
            amount: amount
        });
    }
}

const userService = new UserService();
export default userService;