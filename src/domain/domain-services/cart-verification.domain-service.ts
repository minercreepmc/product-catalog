import { cartRepositoryDiToken, CartRepositoryPort } from '@domain-interfaces';
import { Inject } from '@nestjs/common';

export class CartVerificationDomainService {
  constructor(
    @Inject(cartRepositoryDiToken)
    private readonly cartRepository: CartRepositoryPort,
  ) {}
}
