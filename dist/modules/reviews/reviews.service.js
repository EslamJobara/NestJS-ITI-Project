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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const product_entity_1 = require("../products/entities/product.entity");
const review_entity_1 = require("./entities/review.entity");
let ReviewsService = class ReviewsService {
    reviewsRepository;
    productsRepository;
    constructor(reviewsRepository, productsRepository) {
        this.reviewsRepository = reviewsRepository;
        this.productsRepository = productsRepository;
    }
    async create(userId, dto) {
        const product = await this.productsRepository.findOneBy({ id: dto.productId });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const review = this.reviewsRepository.create({
            rating: dto.rating,
            comment: dto.comment?.trim() || null,
            userId,
            productId: dto.productId,
        });
        return this.reviewsRepository.save(review);
    }
    findByProduct(productId) {
        return this.reviewsRepository.find({
            where: { productId },
            relations: { user: true },
            order: { createdAt: 'DESC' },
        });
    }
    async remove(reviewId, currentUser) {
        const review = await this.reviewsRepository.findOneBy({ id: reviewId });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        const isOwner = review.userId === currentUser.sub;
        const isAdmin = currentUser.role === user_role_enum_1.UserRole.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new common_1.ForbiddenException('You can only delete your own review unless you are an admin');
        }
        await this.reviewsRepository.remove(review);
        return { message: 'Review deleted successfully' };
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map