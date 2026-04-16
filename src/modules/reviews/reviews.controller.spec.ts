import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

describe('ReviewsController', () => {
  let controller: ReviewsController;

  const reviewsService = {
    create: jest.fn(),
    findByProduct: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: reviewsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get(ReviewsController);
  });

  it('customer creates review', async () => {
    reviewsService.create.mockResolvedValue({ id: 1, productId: 2, userId: 7 });

    await expect(
      controller.create(
        { rating: 5, comment: 'Great', productId: 2 },
        {
          sub: 7,
          email: 'customer@test.com',
          role: UserRole.CUSTOMER,
          tokenType: 'access',
        },
      ),
    ).resolves.toEqual({ id: 1, productId: 2, userId: 7 });

    expect(reviewsService.create).toHaveBeenCalledWith(7, {
      rating: 5,
      comment: 'Great',
      productId: 2,
    });
  });

  it('public can list product reviews', async () => {
    reviewsService.findByProduct.mockResolvedValue([{ id: 1, productId: 3 }]);

    await expect(controller.findByProduct(3)).resolves.toEqual([
      { id: 1, productId: 3 },
    ]);
    expect(reviewsService.findByProduct).toHaveBeenCalledWith(3);
  });

  it('unauthorized delete stays blocked', async () => {
    reviewsService.remove.mockRejectedValue(
      new ForbiddenException(
        'You can only delete your own review unless you are an admin',
      ),
    );

    await expect(
      controller.remove(1, {
        sub: 9,
        email: 'customer@test.com',
        role: UserRole.CUSTOMER,
        tokenType: 'access',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('missing review returns not found', async () => {
    reviewsService.remove.mockRejectedValue(
      new NotFoundException('Review not found'),
    );

    await expect(
      controller.remove(999, {
        sub: 1,
        email: 'admin@test.com',
        role: UserRole.ADMIN,
        tokenType: 'access',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
