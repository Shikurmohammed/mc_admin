import { OrderStatus } from "./enums/order_status";
import { OrderItem } from "./order-item";
import { User } from "./user";

export interface Order {
    id: number;
    orderNumber: string;//This will be a unique identifier for the order, it can be used for tracking and reference purposes.
    user: User;
    userId: number;
    items: OrderItem[];
    totalAmount: number;//This will be the total amount for the order, calculated as the sum of the subtotals of all order items, it can be used for displaying the order summary and for payment processing.
    status: OrderStatus;//This will be the current status of the order, it can be used for tracking the order progress and for displaying the order status to customers.
    shippingAddress?: string;
    billingAddress?: string;//This can be used for storing the shipping and billing addresses for the order, it can be useful for order fulfillment and for providing customers with delivery information.
    trackingNumber?: string;//This can be used for tracking the shipment of the order, it can be useful for providing customers with updates on their order delivery status.
    notes?: string;//This can be used for any additional notes or instructions related to the order, it can be useful for communication between customers and artisans or for internal use by the platform.
    createdAt: string;
    completedAt?: string;
}

