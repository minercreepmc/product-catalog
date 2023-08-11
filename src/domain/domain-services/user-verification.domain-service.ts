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
}
