
import { Craft } from './craft';

export interface OrderItem {
    id: number;
    craft: Craft;//This will be the craft object associated with the order item, it can include details like title, price, and image.
    craftId: number;//
    quantity: number;//This will be the quantity of the craft item ordered, it can be used to calculate the total price for the order item.
    unitPrice: number;//This will be the price of a single unit of the craft item at the time of order, it can be used to calculate the total price for the order item and also for historical pricing data.
    subtotal: number;//This will be the total price for the order item, calculated as quantity multiplied by unit price, it can be used for displaying the order summary and for payment processing.
    createdAt: string;
    updatedAt: string;
}
