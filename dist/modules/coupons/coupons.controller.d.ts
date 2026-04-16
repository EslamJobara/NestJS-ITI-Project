import { CreateCouponDto, UpdateCouponDto } from './dto/create-coupon.dto';
import { CouponsService } from './coupons.service';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    create(dto: CreateCouponDto): Promise<import("./entities/coupon.entity").Coupon>;
    findAll(): Promise<import("./entities/coupon.entity").Coupon[]>;
    update(id: number, dto: UpdateCouponDto): Promise<import("./entities/coupon.entity").Coupon>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
