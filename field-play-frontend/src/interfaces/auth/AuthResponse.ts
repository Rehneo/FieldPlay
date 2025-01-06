import User from "./User.ts";

export default interface AuthResponse {
    token: string;
    user: User;
}