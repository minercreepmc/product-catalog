import {
  CartAggregate,
  CreateCartAggregateOptions,
  UpdateCartAggregateOptions,
} from '@aggregates/cart';
import { cartRepositoryDiToken, CartRepositoryPort } from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { UserIdValueObject } from '@value-objects/user';
import { CartVerificationDomainService } from './cart-verification.domain-service';
import { UserVerificationDomainService } from './user-verification.domain-service';

export interface UpdateCartDomainServiceOptions {
  userId: UserIdValueObject;
  payload: UpdateCartAggregateOptions;
}

@Injectable()
export class CartManagementDomainService {
  constructor(
    @Inject(cartRepositoryDiToken)
    private readonly cartRepository: CartRepositoryPort,
    private readonly cartVerificationService: CartVerificationDomainService,
    private readonly userVerificationService: UserVerificationDomainService,
  ) {}
  async createCart(options: CreateCartAggregateOptions) {
    const cart = new CartAggregate();
    const cartCreated = cart.createCart(options);

    await this.cartRepository.create(cart);

    return cartCreated;
  }

  async updateCart(options: UpdateCartDomainServiceOptions) {
    const { userId, payload } = options;

    await this.userVerificationService.findOneOrThrow(userId);
    let cart = await this.cartVerificationService.findOneOrThrow(userId);

    if (!cart) {
      cart = new CartAggregate();
      cart.createCart({
        userId,
      });
      await this.cartRepository.create(cart);
    }

    const cartUpdated = cart.updateCart(payload);
    await this.cartRepository.updateOneByUserId(userId, cart);

    return cartUpdated;
  }
}
