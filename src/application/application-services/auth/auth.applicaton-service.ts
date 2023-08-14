import * as bcrypt from 'bcrypt';
import { UserAggregate } from '@aggregates/user';
import {
  userRepositoryDiToken,
  UserRepositoryPort,
} from '@application/interface/user';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  UserFullNameValueObject,
  UserIdValueObject,
  UserNameValueObject,
  UserPasswordValueObject,
  UserRoleValueObject,
} from '@value-objects/user';
import { AuthServicePort } from '@domain-interfaces/services';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserSchema } from '@database/repositories/pg/user';

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class AuthApplicationService implements AuthServicePort {
  constructor(
    @Inject(userRepositoryDiToken)
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async doesUserIdExist(id: UserIdValueObject): Promise<boolean> {
    const exist = await this.userRepository.findOneById(id.value);
    return Boolean(exist);
  }

  async handlerAuthAndSaveToDb(aggregate: UserAggregate): Promise<void> {
    const hashed = await bcrypt.hash(aggregate.password!.value, 10);

    await this.userRepository.create({
      id: aggregate.id.value,
      role: aggregate.role.value,
      username: aggregate.username.value,
      full_name: aggregate.fullName ? aggregate.fullName.value : undefined,
      hashed,
    });
  }

  async doesUserNameExist(name: UserNameValueObject): Promise<boolean> {
    return Boolean(await this.userRepository.findOneByName(name.value));
  }

  async getAuthenticatedUser(
    username: string,
    password: string,
  ): Promise<UserSchema> {
    const user = await this.userRepository.findOneByName(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordMatching = await bcrypt.compare(password, user.hashed!);

    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }

    return user;
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

    return this.verifyPassword(password.value, user.hashed!);
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

  getLogOutCookie(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  async findOneByUsername(
    username: UserNameValueObject,
  ): Promise<UserAggregate | null> {
    const userSchema = await this.userRepository.findOneByName(username.value);
    if (!userSchema) return Promise.resolve(null);

    return new UserAggregate({
      id: new UserIdValueObject(userSchema?.id),
      role: new UserRoleValueObject(userSchema.role),
      username: new UserNameValueObject(userSchema.username),
      fullName: new UserFullNameValueObject(userSchema.full_name),
    });
  }
}
