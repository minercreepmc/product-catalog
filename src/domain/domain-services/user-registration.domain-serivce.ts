import { UserAggregate } from '@aggregates/user/user.aggregate';
import { RegisterUserAggregateOptions } from '@aggregates/user/user.aggregate.interface';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { unitOfWorkDiToken, UnitOfWorkPort } from '@domain-interfaces';
import {
  authServiceDiToken,
  AuthServicePort,
} from '@domain-interfaces/services';
import { Inject, Injectable } from '@nestjs/common';
import { UserNameValueObject } from '@value-objects/user';

export type RegisterMemberServiceOptions = RegisterUserAggregateOptions;
export type RegisterAdminServiceOptions = RegisterUserAggregateOptions;

@Injectable()
export class UserRegistrationDomainService {
  constructor(
    @Inject(unitOfWorkDiToken)
    private readonly unitOfWork: UnitOfWorkPort,
    @Inject(authServiceDiToken)
    private readonly authService: AuthServicePort,
  ) {}

  async registerMember(options: RegisterMemberServiceOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const isUnique = await this.isUserNameUnique(options.username);

      if (!isUnique) {
        throw new UserDomainExceptions.UsernameAlreadyExists();
      }

      const userAggregate = new UserAggregate();
      const memberRegisteredDomainEvent = userAggregate.registerMember(options);

      this.authService.handlerAuthAndSaveToDb(userAggregate);

      return memberRegisteredDomainEvent;
    });
  }

  async registerAdmin(options: RegisterAdminServiceOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const isUnique = await this.isUserNameUnique(options.username);

      if (!isUnique) {
        throw new UserDomainExceptions.UsernameAlreadyExists();
      }

      const userAggregate = new UserAggregate();
      const adminRegistered = userAggregate.registerAdmin(options);

      this.authService.handlerAuthAndSaveToDb(userAggregate);

      return adminRegistered;
    });
  }

  async isUserNameUnique(username: UserNameValueObject) {
    const exist = await this.authService.isUserNameExist(username);

    if (exist) {
      return false;
    }

    return true;
  }
}
