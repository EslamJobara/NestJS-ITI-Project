import { UserRole } from '../../../common/enums/user-role.enum';
import { Order } from '../../orders/entities/order.entity';
import { Review } from '../../reviews/entities/review.entity';
export declare class User {
    id: number;
    email: string;
    passwordHash: string;
    role: UserRole;
    hashedRefreshToken: string | null;
    orders: Order[];
    reviews: Review[];
    createdAt: Date;
    updatedAt: Date;
}
