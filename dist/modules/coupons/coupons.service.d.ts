import { Repository } from 'typeorm';
import { CreateCouponDto, UpdateCouponDto } from './dto/create-coupon.dto';
import { Coupon } from './entities/coupon.entity';
export declare class CouponsService {
    private readonly couponsRepository;
    constructor(couponsRepository: Repository<Coupon>);
    create(dto: CreateCouponDto): Promise<Coupon>;
    findAll(): Promise<Coupon[]>;
    update(id: number, dto: UpdateCouponDto): Promise<Coupon>;
    remove(id: number): Promise<{
        message: string;
    }>;
    private ensureCodeIsUnique;
    private ensureCouponCanBeActivated;
}
