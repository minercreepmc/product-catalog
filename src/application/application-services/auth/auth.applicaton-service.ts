import * as bcrypt from 'bcrypt';
import { UserAggregate } from '@aggregates/user';
import {
  userRepositoryDiToken,
  UserRepositoryPort,
} from '@application/interface/user';
import { Inject, Injectable } from '@nestjs/common';
import {
  UserNameValueObject,
  UserPasswordValueObject,
  UserRoleValueObject,
} from '@value-objects/user';
import { AuthServicePort } from '@domain-interfaces/services';
import { UserDomainExceptions } from '@domain-exceptions/user';

@Injectable()
export class AuthApplicationService implements AuthServicePort {
  async handlerAuthAndSaveToDb(aggregate: UserAggregate): Promise<void> {
    const hashed = await bcrypt.hash(aggregate.password.value, 10);

    await this.userRepository.create({
      id: aggregate.id.value,
      role: aggregate.role.value,
      username: aggregate.username.value,
      hashed,
    });
  }

  async isUserNameExist(name: UserNameValueObject): Promise<boolean> {
    return Boolean(await this.userRepository.findOneByName(name.value));
  }

  async getAuthenticatedUser(
    username: UserNameValueObject,
    password: UserPasswordValueObject,
  ): Promise<UserAggregate> {
    const user = await this.userRepository.findOneByName(username.value);

    if (!user) {
      throw new UserDomainExceptions.CredentialDoesNotValid();
    }

    const isPasswordMatching = await bcrypt.compare(
      password.value,
      user.hashed,
    );

    if (!isPasswordMatching) {
      throw new UserDomainExceptions.CredentialDoesNotValid();
    }

    return new UserAggregate({
      id: new UserNameValueObject(user.id),
      role: new UserRoleValueObject(user.role),
      username: new UserNameValueObject(user.username),
    });
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  constructor(
    @Inject(userRepositoryDiToken)
    private readonly userRepository: UserRepositoryPort,
  ) {}
}
