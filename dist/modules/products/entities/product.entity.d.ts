import { Category } from '../../categories/entities/category.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Review } from '../../reviews/entities/review.entity';
export declare class Product {
    id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    category: Category;
    categoryId: number;
    orderItems: OrderItem[];
    reviews: Review[];
    createdAt: Date;
    updatedAt: Date;
}
