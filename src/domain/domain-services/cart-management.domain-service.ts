import {
  CartAggregate,
  CreateCartAggregateOptions,
  UpdateCartAggregateOptions,
} from '@aggregates/cart';
import { cartRepositoryDiToken, CartRepositoryPort } from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { CartIdValueObject } from '@value-objects/cart';
import { UserIdValueObject } from '@value-objects/user';

export interface UpdateCartDomainServiceOptions {
  id: CartIdValueObject;
  userId: UserIdValueObject;
  payload: UpdateCartAggregateOptions;
}

@Injectable()
export class CartManagementDomainService {
  constructor(
    @Inject(cartRepositoryDiToken)
    private readonly cartRepository: CartRepositoryPort,
  ) {}
  async createCart(options: CreateCartAggregateOptions) {
    const cart = new CartAggregate();
    const cartCreated = cart.createCart(options);

    await this.cartRepository.create(cart);

    return cartCreated;
  }

  async updateCart(options: UpdateCartDomainServiceOptions) {
    const { id, userId, payload } = options;
    let cart = await this.cartRepository.findOneById(id);

    if (!cart) {
      cart = new CartAggregate();
      cart.createCart({
        userId,
      });
      await this.cartRepository.create(cart);
    }

    const cartUpdated = cart.updateCart(payload);
    await this.cartRepository.updateOneById(id, cart);

    return cartUpdated;
  }
}
