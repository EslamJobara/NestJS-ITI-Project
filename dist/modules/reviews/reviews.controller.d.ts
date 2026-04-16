import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(dto: CreateReviewDto, user: JwtPayload): Promise<import("./entities/review.entity").Review>;
    findByProduct(productId: number): Promise<import("./entities/review.entity").Review[]>;
    remove(id: number, user: JwtPayload): Promise<{
        message: string;
    }>;
}
