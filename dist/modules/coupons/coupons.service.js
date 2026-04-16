"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const coupon_entity_1 = require("./entities/coupon.entity");
let CouponsService = class CouponsService {
    couponsRepository;
    constructor(couponsRepository) {
        this.couponsRepository = couponsRepository;
    }
    async create(dto) {
        await this.ensureCodeIsUnique(dto.code);
        if (dto.discountPercent < 1 || dto.discountPercent > 90) {
            throw new common_1.BadRequestException('Discount percentage must be between 1 and 90');
        }
        const expiresAt = new Date(dto.expiresAt);
        if (Number.isNaN(expiresAt.getTime())) {
            throw new common_1.BadRequestException('Coupon expiration date is invalid');
        }
        const coupon = this.couponsRepository.create({
            code: dto.code.trim().toUpperCase(),
            discountPercent: dto.discountPercent,
            expiresAt,
            isActive: true,
        });
        return this.couponsRepository.save(coupon);
    }
    findAll() {
        return this.couponsRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, dto) {
        const coupon = await this.couponsRepository.findOneBy({ id });
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
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
                throw new common_1.BadRequestException('Discount percentage must be between 1 and 90');
            }
            coupon.discountPercent = dto.discountPercent;
        }
        if (dto.expiresAt) {
            const expiresAt = new Date(dto.expiresAt);
            if (Number.isNaN(expiresAt.getTime())) {
                throw new common_1.BadRequestException('Coupon expiration date is invalid');
            }
            coupon.expiresAt = expiresAt;
        }
        if (dto.isActive !== undefined) {
            this.ensureCouponCanBeActivated(dto.isActive, coupon.expiresAt);
            coupon.isActive = dto.isActive;
        }
        return this.couponsRepository.save(coupon);
    }
    async remove(id) {
        const coupon = await this.couponsRepository.findOneBy({ id });
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        await this.couponsRepository.remove(coupon);
        return { message: 'Coupon deleted successfully' };
    }
    async ensureCodeIsUnique(code, excludeId) {
        const normalizedCode = code.trim().toUpperCase();
        const existingCoupon = await this.couponsRepository.findOneBy({
            code: normalizedCode,
        });
        if (existingCoupon && existingCoupon.id !== excludeId) {
            throw new common_1.ConflictException('Coupon code already exists');
        }
    }
    ensureCouponCanBeActivated(isActive, expiresAt) {
        if (isActive && expiresAt.getTime() <= Date.now()) {
            throw new common_1.BadRequestException('Expired coupons cannot be activated');
        }
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map