import { CartAggregate } from '@aggregates/cart';
import { CartDomainExceptions } from '@domain-exceptions/cart';
import { cartRepositoryDiToken, CartRepositoryPort } from '@domain-interfaces';
import { CartItemEntity } from '@entities';
import { Inject, Injectable } from '@nestjs/common';
import { hasDuplicates } from '@utils/functions';
import { CartIdValueObject } from '@value-objects/cart';

@Injectable()
export class CartVerificationDomainService {
  constructor(
    @Inject(cartRepositoryDiToken)
    private readonly cartRepository: CartRepositoryPort,
  ) {}

  async doesCartIdExist(cartId: CartIdValueObject): Promise<boolean> {
    const cart = await this.cartRepository.findOneById(cartId);

    return !!cart;
  }

  async doesCartItemsDuplicate(cartItems: CartItemEntity[]) {
    const ids = cartItems.map((item) => item.productId.value);

    return hasDuplicates(ids);
  }

  async findOneOrThrow(cartId: CartIdValueObject): Promise<CartAggregate> {
    const cart = await this.cartRepository.findOneById(cartId);

    if (!cart) {
      throw new CartDomainExceptions.DoesNotExist();
    }

    return cart;
  }
}
