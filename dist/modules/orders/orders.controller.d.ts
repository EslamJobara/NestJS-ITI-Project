import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto, user: JwtPayload): Promise<import("./entities/order.entity").Order>;
    findMyOrders(user: JwtPayload): Promise<import("./entities/order.entity").Order[]>;
    findAll(): Promise<import("./entities/order.entity").Order[]>;
}
