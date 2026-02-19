import { jwtDecode } from "jwt-decode";

const decodeToken = (token) => {
    if (!token) return null;
    try {
        // Just call the function; JS doesn't use the <JwtPayload> generic
        return jwtDecode(token);
    } catch (error) {
        console.error("Invalid token format", error);
        return null;
    }
};

export default decodeToken;
