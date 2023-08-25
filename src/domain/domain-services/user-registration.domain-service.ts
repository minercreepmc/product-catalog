import {
  RegisterUserAggregateOptions,
  UserAggregate,
  UpdateUserProfileAggregateOptions,
} from '@aggregates/user';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { unitOfWorkDiToken, UnitOfWorkPort } from '@domain-interfaces';
import {
  authServiceDiToken,
  AuthServicePort,
} from '@domain-interfaces/services';
import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { UserIdValueObject, UserNameValueObject } from '@value-objects/user';
import { UserVerificationDomainService } from './user-verification.domain-service';

export type RegisterMemberServiceOptions = RegisterUserAggregateOptions;
export type RegisterAdminServiceOptions = RegisterUserAggregateOptions;
export type UpdateProfileServiceOptions = {
  id: UserIdValueObject;
  payload: UpdateUserProfileAggregateOptions;
};

@Injectable()
export class UserRegistrationDomainService {
  constructor(
    @Inject(unitOfWorkDiToken)
    private readonly unitOfWork: UnitOfWorkPort,
    @Inject(authServiceDiToken)
    private readonly authService: AuthServicePort,
    private readonly userVerificationService: UserVerificationDomainService,
    private readonly eventBus: EventBus,
  ) {}

  async registerMember(options: RegisterMemberServiceOptions) {
    const memberRegsitered = await this.unitOfWork.runInTransaction(
      async () => {
        const exist = await this.isUserNameExistByName(options.username);

        if (exist) {
          throw new UserDomainExceptions.UsernameAlreadyExists();
        }

        const userAggregate = new UserAggregate();
        const memberRegisteredDomainEvent =
          userAggregate.registerMember(options);

        await this.authService.handlerAuthAndSaveToDb(userAggregate);

        return memberRegisteredDomainEvent;
      },
    );

    this.eventBus.publish(memberRegsitered);
    return memberRegsitered;
  }

  async registerAdmin(options: RegisterAdminServiceOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const exist = await this.isUserNameExistByName(options.username);

      if (exist) {
        throw new UserDomainExceptions.UsernameAlreadyExists();
      }

      const userAggregate = new UserAggregate();
      const adminRegistered = userAggregate.registerAdmin(options);

      await this.authService.handlerAuthAndSaveToDb(userAggregate);

      return adminRegistered;
    });
  }

  async updateProfile(options: UpdateProfileServiceOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const { id, payload } = options;
      const userAggregate = await this.userVerificationService.findOneOrThrow(
        id,
      );
      const userUpdated = userAggregate.updateProfile(payload);
      await this.authService.handleAuthAndUpdateToDb(userAggregate);
      return userUpdated;
    });
  }

  async isUserNameExistByName(username: UserNameValueObject) {
    const exist = await this.authService.doesUserNameExist(username);

    return Boolean(exist);
  }
}
