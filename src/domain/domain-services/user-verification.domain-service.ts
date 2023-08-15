import { UserDomainExceptions } from '@domain-exceptions/user';
import {
  authServiceDiToken,
  AuthServicePort,
} from '@domain-interfaces/services';
import { Inject, Injectable } from '@nestjs/common';
import { UserIdValueObject } from '@value-objects/user';

@Injectable()
export class UserVerificationDomainService {
  constructor(
    @Inject(authServiceDiToken)
    private readonly authService: AuthServicePort,
  ) {}

  doesUserIdExist(id: UserIdValueObject) {
    return this.authService.doesUserIdExist(id);
  }

  async findOneOrThrow(id: UserIdValueObject) {
    const exist = await this.authService.doesUserIdExist(id);

    if (!exist) {
      throw new UserDomainExceptions.DoesNotExist();
    }
    return exist;
  }
}