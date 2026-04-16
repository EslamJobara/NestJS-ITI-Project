import { Repository } from 'typeorm';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
export declare class OrdersService {
    private readonly ordersRepository;
    private readonly productsService;
    constructor(ordersRepository: Repository<Order>, productsService: ProductsService);
    createForUser(dto: CreateOrderDto, user: JwtPayload): Promise<Order>;
    findMyOrders(userId: number): Promise<Order[]>;
    findAll(): Promise<Order[]>;
}
