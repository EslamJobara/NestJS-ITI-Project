import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class CannotActivateExpiredCouponConstraint implements ValidatorConstraintInterface {
    validate(_value: unknown, args: ValidationArguments): boolean;
    defaultMessage(): string;
}
export declare function CannotActivateExpiredCoupon(validationOptions?: ValidationOptions): (target: object) => void;
