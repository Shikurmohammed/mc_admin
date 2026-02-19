import { ReactNode } from "react";
import { UserRole } from "./enums/user_role";

export interface User {
 
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;

    // Additional fields, may be we can include associated with artisan or customer and reviews (for rating details).
    rating: any;
    craftsCount: ReactNode;
}