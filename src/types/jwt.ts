import { User } from "./user";

export interface JwtPayload {
    // sub: number;
    // email: string;
    sub: User;
    iat: number;
    exp: number;
    role: string;
    access_token: string;
}
