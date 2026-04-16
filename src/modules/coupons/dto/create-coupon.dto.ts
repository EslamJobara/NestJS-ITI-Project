import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { CannotActivateExpiredCoupon } from '../validators/cannot-activate-expired-coupon.validator';

export class CreateCouponDto {
  @IsString()
  @Matches(/^[A-Z0-9_-]+$/, {
    message:
      'Coupon code must contain only uppercase letters, numbers, dashes, or underscores',
  })
  code: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(90)
  discountPercent: number;

  @IsDateString()
  expiresAt: string;
}

@CannotActivateExpiredCoupon()
export class UpdateCouponDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9_-]+$/, {
    message:
      'Coupon code must contain only uppercase letters, numbers, dashes, or underscores',
  })
  code?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(90)
  discountPercent?: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
