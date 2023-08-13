import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import { CartItemEntity } from '@entities';
import { CartIdValueObject } from '@value-objects/cart';
import { UserIdValueObject } from '@value-objects/user';
import { validateSync } from 'class-validator';

export class UpdateCartCommand implements CommandBase {
  cartId: CartIdValueObject;
  items: CartItemEntity[];
  userId: UserIdValueObject;

  validate?() {
    let isValid: boolean;
    if (validateSync(this).length > 0) {
      isValid = false;
    }

    let exceptions: DomainExceptionBase[] = [];

    isValid = !this.items.some((item) => {
      exceptions = item.validate();
      if (exceptions.length > 0) return true;
      return false;
    });

    const otherExceptions = [
      this.cartId?.validate?.(),
      this.userId?.validate?.(),
    ].filter((e) => e) as DomainExceptionBase[];

    if (!isValid) {
      return [...exceptions, ...otherExceptions];
    } else {
      return otherExceptions;
    }
  }

  constructor(options: UpdateCartCommand) {
    this.items = options.items;
    this.userId = options.userId;
    this.cartId = options.cartId;
  }
}

export class UpdateCartResponseDto {
  items: {
    id: string;
    price: number;
    amount: number;
    cartId: string;
    productId: string;
  }[];
  userId: string;
  constructor(options: UpdateCartResponseDto) {
    this.items = options.items;
    this.userId = options.userId;
  }
}
