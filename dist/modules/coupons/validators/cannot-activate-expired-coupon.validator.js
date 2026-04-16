"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotActivateExpiredCouponConstraint = void 0;
exports.CannotActivateExpiredCoupon = CannotActivateExpiredCoupon;
const class_validator_1 = require("class-validator");
let CannotActivateExpiredCouponConstraint = class CannotActivateExpiredCouponConstraint {
    validate(_value, args) {
        const dto = args.object;
        if (dto.isActive !== true || !dto.expiresAt) {
            return true;
        }
        return new Date(dto.expiresAt).getTime() > Date.now();
    }
    defaultMessage() {
        return 'Expired coupons cannot be activated';
    }
};
exports.CannotActivateExpiredCouponConstraint = CannotActivateExpiredCouponConstraint;
exports.CannotActivateExpiredCouponConstraint = CannotActivateExpiredCouponConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'cannotActivateExpiredCoupon', async: false })
], CannotActivateExpiredCouponConstraint);
function CannotActivateExpiredCoupon(validationOptions) {
    return (target) => {
        (0, class_validator_1.registerDecorator)({
            target: target.constructor,
            propertyName: '_couponActivationRule',
            options: validationOptions,
            validator: CannotActivateExpiredCouponConstraint,
        });
    };
}
//# sourceMappingURL=cannot-activate-expired-coupon.validator.js.map