export declare class CreateCouponDto {
    code: string;
    discountPercent: number;
    expiresAt: string;
}
export declare class UpdateCouponDto {
    code?: string;
    discountPercent?: number;
    expiresAt?: string;
    isActive?: boolean;
}
