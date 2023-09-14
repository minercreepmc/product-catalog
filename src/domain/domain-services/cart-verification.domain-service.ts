import { CartAggregate } from '@aggregates/cart';
import { CartDomainExceptions } from '@domain-exceptions/cart';
import { cartRepositoryDiToken, CartRepositoryPort } from '@domain-interfaces';
import { CartItemEntity } from '@entities';
import { Inject, Injectable } from '@nestjs/common';
import { hasDuplicates } from '@utils/functions';
import { CartIdValueObject } from '@value-objects/cart';
import { ProductIdValueObject } from '@value-objects/product';
import { UserIdValueObject } from '@value-objects/user';

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

  async doesCartItemsDuplicate(productIds: ProductIdValueObject[]) {
    return hasDuplicates(productIds.map((productId) => productId.value));
  }

  async findOneOrThrow(userId: UserIdValueObject): Promise<CartAggregate> {
    const cart = await this.cartRepository.findOneByUserId(userId);

    if (!cart) {
      throw new CartDomainExceptions.DoesNotExist();
    }

    return cart;
  }
}
