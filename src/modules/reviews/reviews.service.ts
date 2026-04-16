import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { Product } from '../products/entities/product.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(userId: number, dto: CreateReviewDto): Promise<Review> {
    const product = await this.productsRepository.findOneBy({ id: dto.productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const review = this.reviewsRepository.create({
      rating: dto.rating,
      comment: dto.comment?.trim() || null,
      userId,
      productId: dto.productId,
    });

    return this.reviewsRepository.save(review);
  }

  findByProduct(productId: number): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { productId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(
    reviewId: number,
    currentUser: JwtPayload,
  ): Promise<{ message: string }> {
    const review = await this.reviewsRepository.findOneBy({ id: reviewId });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const isOwner = review.userId === currentUser.sub;
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You can only delete your own review unless you are an admin',
      );
    }

    await this.reviewsRepository.remove(review);
    return { message: 'Review deleted successfully' };
  }
}
