import * as bcrypt from 'bcrypt';
import { UserAggregate } from '@aggregates/user';
import {
  userRepositoryDiToken,
  UserRepositoryPort,
} from '@application/interface/user';
import { Inject, Injectable } from '@nestjs/common';
import {
  UserIdValueObject,
  UserNameValueObject,
  UserPasswordValueObject,
  UserRoleValueObject,
} from '@value-objects/user';
import { AuthServicePort } from '@domain-interfaces/services';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface TokenPayload {
  userId: string;
}

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

  async isPasswordMatchByUserName(
    username: UserNameValueObject,
    password: UserPasswordValueObject,
  ): Promise<boolean> {
    const user = await this.userRepository.findOneByName(username.value);

    if (!user) {
      throw new UserDomainExceptions.CredentialDoesNotValid();
    }

    return this.verifyPassword(password.value, user.hashed);
  }

  getAuthenticatedCookie(userId: UserIdValueObject): string {
    const payload: TokenPayload = {
      userId: userId.value,
    };

    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  async findOneByUsername(
    username: UserNameValueObject,
  ): Promise<UserAggregate> {
    const userSchema = await this.userRepository.findOneByName(username.value);

    return new UserAggregate({
      id: new UserNameValueObject(userSchema.id),
      role: new UserRoleValueObject(userSchema.role),
      username: new UserNameValueObject(userSchema.username),
    });
  }

  constructor(
    @Inject(userRepositoryDiToken)
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
}
