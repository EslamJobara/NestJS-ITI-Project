import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { CannotActivateExpiredCouponConstraint } from './validators/cannot-activate-expired-coupon.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon])],
  controllers: [CouponsController],
  providers: [CouponsService, CannotActivateExpiredCouponConstraint],
  exports: [CouponsService],
})
export class CouponsModule {}
