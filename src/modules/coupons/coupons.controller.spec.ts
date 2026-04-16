import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';

describe('CouponsController', () => {
  let controller: CouponsController;

  const couponsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponsController],
      providers: [
        {
          provide: CouponsService,
          useValue: couponsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<CouponsController>(CouponsController);
  });

  it('rejects duplicate code', async () => {
    couponsService.create.mockRejectedValue(
      new ConflictException('Coupon code already exists'),
    );

    await expect(
      controller.create({
        code: 'SAVE20',
        discountPercent: 20,
        expiresAt: '2099-01-01T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects invalid discount', async () => {
    couponsService.create.mockRejectedValue(
      new BadRequestException('Discount percentage must be between 1 and 90'),
    );

    await expect(
      controller.create({
        code: 'SAVE95',
        discountPercent: 95,
        expiresAt: '2099-01-01T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lists coupons for admin flow', async () => {
    couponsService.findAll.mockResolvedValue([{ id: 1, code: 'SAVE20' }]);

    await expect(controller.findAll()).resolves.toEqual([
      { id: 1, code: 'SAVE20' },
    ]);
    expect(couponsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('updates coupon', async () => {
    couponsService.update.mockResolvedValue({ id: 1, isActive: false });

    await expect(controller.update(1, { isActive: false })).resolves.toEqual({
      id: 1,
      isActive: false,
    });
    expect(couponsService.update).toHaveBeenCalledWith(1, { isActive: false });
  });
});
