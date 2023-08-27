import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import {
  OrderAddressValueObject,
  OrderTotalPriceValueObject,
} from '@value-objects/order';
import { UserIdValueObject } from '@value-objects/user';

export class CreateOrderCommand implements CommandBase {
  constructor(options: CreateOrderCommand) {
    this.userId = options.userId;
    this.address = options.address;
    this.totalPrice = options.totalPrice;
  }
  userId: UserIdValueObject;
  address: OrderAddressValueObject;
  totalPrice: OrderTotalPriceValueObject;

  validate?(): DomainExceptionBase[] {
    return [
      this.userId.validate(),
      this.address.validate?.(),
      this.totalPrice?.validate?.(),
    ].filter((e) => e) as DomainExceptionBase[];
  }
}

export class CreateOrderResponseDto {
  id: string;
  userId: string;
  address: string;
  totalPrice: number;

  constructor(options: CreateOrderResponseDto) {
    this.id = options.id;
    this.userId = options.userId;
    this.address = options.address;
    this.totalPrice = options.totalPrice;
  }
}
