import { OrderStatus } from '../../../common/enums/order-status.enum';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare class Order {
    id: number;
    user: User;
    userId: number;
    status: OrderStatus;
    totalPrice: string;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
