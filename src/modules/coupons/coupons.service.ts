import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCouponDto, UpdateCouponDto } from './dto/create-coupon.dto';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponsRepository: Repository<Coupon>,
  ) {}

  async create(dto: CreateCouponDto): Promise<Coupon> {
    await this.ensureCodeIsUnique(dto.code);

    if (dto.discountPercent < 1 || dto.discountPercent > 90) {
      throw new BadRequestException(
        'Discount percentage must be between 1 and 90',
      );
    }

    const expiresAt = new Date(dto.expiresAt);
    if (Number.isNaN(expiresAt.getTime())) {
      throw new BadRequestException('Coupon expiration date is invalid');
    }

    const coupon = this.couponsRepository.create({
      code: dto.code.trim().toUpperCase(),
      discountPercent: dto.discountPercent,
      expiresAt,
      isActive: true,
    });

    return this.couponsRepository.save(coupon);
  }

  findAll(): Promise<Coupon[]> {
    return this.couponsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.couponsRepository.findOneBy({ id });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (dto.code) {
      const normalizedCode = dto.code.trim().toUpperCase();
      if (normalizedCode !== coupon.code) {
        await this.ensureCodeIsUnique(normalizedCode, id);
      }
      coupon.code = normalizedCode;
    }

    if (dto.discountPercent !== undefined) {
      if (dto.discountPercent < 1 || dto.discountPercent > 90) {
        throw new BadRequestException(
          'Discount percentage must be between 1 and 90',
        );
      }
      coupon.discountPercent = dto.discountPercent;
    }

    if (dto.expiresAt) {
      const expiresAt = new Date(dto.expiresAt);
      if (Number.isNaN(expiresAt.getTime())) {
        throw new BadRequestException('Coupon expiration date is invalid');
      }
      coupon.expiresAt = expiresAt;
    }

    if (dto.isActive !== undefined) {
      this.ensureCouponCanBeActivated(dto.isActive, coupon.expiresAt);
      coupon.isActive = dto.isActive;
    }

    return this.couponsRepository.save(coupon);
  }

  async remove(id: number): Promise<{ message: string }> {
    const coupon = await this.couponsRepository.findOneBy({ id });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    await this.couponsRepository.remove(coupon);
    return { message: 'Coupon deleted successfully' };
  }

  private async ensureCodeIsUnique(
    code: string,
    excludeId?: number,
  ): Promise<void> {
    const normalizedCode = code.trim().toUpperCase();
    const existingCoupon = await this.couponsRepository.findOneBy({
      code: normalizedCode,
    });

    if (existingCoupon && existingCoupon.id !== excludeId) {
      throw new ConflictException('Coupon code already exists');
    }
  }

  private ensureCouponCanBeActivated(isActive: boolean, expiresAt: Date): void {
    if (isActive && expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException('Expired coupons cannot be activated');
    }
  }
}
