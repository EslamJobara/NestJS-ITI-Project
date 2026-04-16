import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';
export declare class Review {
    id: number;
    rating: number;
    comment: string | null;
    userId: number;
    productId: number;
    user: User;
    product: Product;
    createdAt: Date;
    updatedAt: Date;
}
