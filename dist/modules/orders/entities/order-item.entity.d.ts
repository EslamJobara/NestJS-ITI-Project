import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';
export declare class OrderItem {
    id: number;
    order: Order;
    orderId: number;
    product: Product;
    productId: number;
    quantity: number;
    priceAtPurchase: string;
}
