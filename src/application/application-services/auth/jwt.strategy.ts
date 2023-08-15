import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenPayload } from './auth.applicaton-service';
import {
  userRepositoryDiToken,
  UserRepositoryPort,
} from '@application/interface/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(userRepositoryDiToken)
    private readonly userRepository: UserRepositoryPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return (
            request?.headers?.cookie
              ?.split(';')
              .find((cookie) => cookie.trim().startsWith('Authentication='))
              ?.split('=')[1] || ''
          );
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    return this.userRepository.findOneById(payload.userId);
  }
}
