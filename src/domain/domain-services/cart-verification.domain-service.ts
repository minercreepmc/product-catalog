import { CartAggregate } from '@aggregates/cart';
import { CartDomainExceptions } from '@domain-exceptions/cart';
import { cartRepositoryDiToken, CartRepositoryPort } from '@domain-interfaces';
import { CartItemEntity } from '@entities';
import { Inject, Injectable } from '@nestjs/common';
import { hasDuplicates } from '@utils/functions';
import { UserIdValueObject } from '@value-objects/user';

@Injectable()
export class CartVerificationDomainService {
  constructor(
    @Inject(cartRepositoryDiToken)
    private readonly cartRepository: CartRepositoryPort,
  ) {}

  async doesCartIdExist(cartId: UserIdValueObject): Promise<boolean> {
    const cart = await this.cartRepository.findOneById(cartId);

    return !!cart;
  }

  async doesCartItemsDuplicate(cartItems: CartItemEntity[]) {
    const ids = cartItems.map((item) => item.productId.value);

    return hasDuplicates(ids);
  }

  async findOneOrThrow(userId: UserIdValueObject): Promise<CartAggregate> {
    const cart = await this.cartRepository.findOneByUserId(userId);

    if (!cart) {
      throw new CartDomainExceptions.DoesNotExist();
    }

    return cart;
  }
}
