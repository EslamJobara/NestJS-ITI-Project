import { Repository } from 'typeorm';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { Product } from '../products/entities/product.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';
export declare class ReviewsService {
    private readonly reviewsRepository;
    private readonly productsRepository;
    constructor(reviewsRepository: Repository<Review>, productsRepository: Repository<Product>);
    create(userId: number, dto: CreateReviewDto): Promise<Review>;
    findByProduct(productId: number): Promise<Review[]>;
    remove(reviewId: number, currentUser: JwtPayload): Promise<{
        message: string;
    }>;
}
