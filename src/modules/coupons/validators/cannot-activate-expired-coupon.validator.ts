import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'cannotActivateExpiredCoupon', async: false })
export class CannotActivateExpiredCouponConstraint
  implements ValidatorConstraintInterface
{
  validate(_value: unknown, args: ValidationArguments): boolean {
    const dto = args.object as { isActive?: boolean; expiresAt?: string };

    if (dto.isActive !== true || !dto.expiresAt) {
      return true;
    }

    return new Date(dto.expiresAt).getTime() > Date.now();
  }

  defaultMessage(): string {
    return 'Expired coupons cannot be activated';
  }
}

export function CannotActivateExpiredCoupon(
  validationOptions?: ValidationOptions,
) {
  return (target: object) => {
    registerDecorator({
      target: target.constructor,
      propertyName: '_couponActivationRule',
      options: validationOptions,
      validator: CannotActivateExpiredCouponConstraint,
    });
  };
}
