import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { UserRepository } from '@v2/users';
import * as bcrypt from 'bcrypt';
import type { TokenPayload } from './constants';
import type { LogInDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async isLoggedIn(cookie: string) {
    if (!cookie) {
      return false;
    }
    const jwtVerifyOptions: JwtVerifyOptions = {
      // TODO: verify config
      secret: this.configService.get('JWT_SECRET')!,
    };
    const payload = this.jwtService.verify(cookie, jwtVerifyOptions);
    const user = await this.userRepository.findOneById(payload.userId);
    return Boolean(user);
  }

  async logIn(dto: LogInDto) {
    const user = await this.userRepository.findOneByName(dto.username);
    const cookie = this.getAuthenticatedCookie(user.id);

    return {
      cookie,
      user,
    };
  }

  async getAuthenticatedUser(username: string, password: string) {
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

  getLogOutCookie(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  private getAuthenticatedCookie(userId: string): string {
    const payload: TokenPayload = {
      userId,
    };

    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}; sameSite=none; secure=true`;
  }
}
