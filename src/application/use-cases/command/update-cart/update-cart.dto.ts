import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import { CartItemEntity } from '@entities';
import { UserIdValueObject } from '@value-objects/user';

export class UpdateCartCommand implements CommandBase {
  items: CartItemEntity[];
  userId: UserIdValueObject;

  validate?(): DomainExceptionBase[] {
    for (const item of this.items) {
      const exceptions = item.validate().filter((e) => e);

      if (exceptions.length > 0) {
        return exceptions;
      }
    }

    return [];
  }

  constructor(options: UpdateCartCommand) {
    this.userId = options.userId;
    this.items = options.items;
  }
}

export class UpdateCartResponseDto {
  items: {
    name: string;
    price: number;
    productId: string;
    amount: number;
    cartId: string;
    discount: number;
    imageUrl?: string;
    totalPrice: number;
  }[];
  id: string;
  totalPrice: number;
  userId: string;
  constructor(options: UpdateCartResponseDto) {
    this.items = options.items;
    this.userId = options.userId;
    this.totalPrice = options.totalPrice;
    this.id = options.id;
  }
}
