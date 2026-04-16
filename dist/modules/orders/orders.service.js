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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_status_enum_1 = require("../../common/enums/order-status.enum");
const products_service_1 = require("../products/products.service");
const order_entity_1 = require("./entities/order.entity");
let OrdersService = class OrdersService {
    ordersRepository;
    productsService;
    constructor(ordersRepository, productsService) {
        this.ordersRepository = ordersRepository;
        this.productsService = productsService;
    }
    async createForUser(dto, user) {
        const items = [];
        let total = 0;
        for (const itemDto of dto.items) {
            const product = await this.productsService.findOne(itemDto.productId);
            const unitPrice = Number(product.price);
            total += unitPrice * itemDto.quantity;
            items.push({
                product,
                productId: product.id,
                quantity: itemDto.quantity,
                priceAtPurchase: unitPrice.toFixed(2),
            });
        }
        const order = this.ordersRepository.create({
            userId: user.sub,
            status: order_status_enum_1.OrderStatus.PENDING,
            totalPrice: total.toFixed(2),
            items,
        });
        return this.ordersRepository.save(order);
    }
    findMyOrders(userId) {
        return this.ordersRepository.find({
            where: { userId },
            order: { id: 'DESC' },
        });
    }
    findAll() {
        return this.ordersRepository.find({ order: { id: 'DESC' } });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        products_service_1.ProductsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map