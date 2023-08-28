import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import {
  OrderAddressValueObject,
  OrderTotalPriceValueObject,
} from '@value-objects/order';
import { ProductIdValueObject } from '@value-objects/product';
import { UserIdValueObject } from '@value-objects/user';

export class CreateOrderCommand implements CommandBase {
  constructor(options: CreateOrderCommand) {
    this.userId = options.userId;
    this.address = options.address;
    this.totalPrice = options.totalPrice;
    this.productIds = options.productIds;
  }
  userId: UserIdValueObject;
  address: OrderAddressValueObject;
  totalPrice: OrderTotalPriceValueObject;
  productIds: ProductIdValueObject[];

  validate?(): DomainExceptionBase[] {
    return [
      this.userId.validate(),
      this.address.validate?.(),
      this.totalPrice?.validate?.(),
      this.productIds?.map((e) => e.validate?.())[0],
    ].filter((e) => e) as DomainExceptionBase[];
  }
}

export class CreateOrderResponseDto {
  id: string;
  userId: string;
  address: string;
  totalPrice: number;
  productIds: string[];

  constructor(options: CreateOrderResponseDto) {
    this.id = options.id;
    this.userId = options.userId;
    this.address = options.address;
    this.totalPrice = options.totalPrice;
    this.productIds = options.productIds;
  }
}
