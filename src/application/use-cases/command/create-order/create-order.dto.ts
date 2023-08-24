import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import { CartIdValueObject } from '@value-objects/cart';
import { OrderAddressValueObject } from '@value-objects/order';
import { UserIdValueObject } from '@value-objects/user';

export class CreateOrderCommand implements CommandBase {
  constructor(options: CreateOrderCommand) {
    this.userId = options.userId;
    this.cartId = options.cartId;
    this.address = options.address;
  }
  userId: UserIdValueObject;
  cartId: CartIdValueObject;
  address: OrderAddressValueObject;

  validate?(): DomainExceptionBase[] {
    return [
      this.userId.validate(),
      this.cartId.validate?.(),
      this.address.validate?.(),
    ].filter((e) => e) as DomainExceptionBase[];
  }
}

export class CreateOrderResponseDto {
  id: string;
  userId: string;
  cartId: string;
  address: string;

  constructor(options: CreateOrderResponseDto) {
    this.id = options.id;
    this.userId = options.userId;
    this.cartId = options.cartId;
    this.address = options.address;
  }
}
