import { ReactNode } from "react";
import { Category } from "./category";
import { Review } from "./review";
import { User } from "./user";

export interface Craft {
    
    id: number;
    title: string;
    description: string;
    price: number;
    images: string[];
    stock: number;//This can be used to manage inventory and display stock availability to customers.
    isAvailable: boolean;//This can be used to indicate if the craft item is currently available for purchase, it can be useful for managing inventory and displaying availability status to customers.
    views: number;//view count for the craft item, can be used for analytics and popularity tracking.
    specifications?: Record<string, any>;//This can include dimensions, materials used, care instructions, etc.
    artisan: User;//This will be the user object of the artisan who created the craft item, it can include details like name, avatar, and rating.
    categories: Category[];//This will be an array of category objects that the craft item belongs to, it can include details like category name and description.
    reviews?: Review[];//This will be an array of review objects for the craft item, it can include details like rating, comment, and reviewer information.
    averageRating: number;//This will be the average rating for the craft item, calculated from the reviews, it can be used for displaying the overall rating of the craft item.
    createdAt: string;
    updatedAt: string;

    //Additional Fields
    wishlistCount: ReactNode;//This can be used to display how many customers have added this craft item to their wishlist, it can be useful for popularity tracking and marketing purposes.
    reviewCount: any;//This can be used to display the total number of reviews for the craft item, it can be useful for providing social proof and encouraging customers to leave reviews.

}