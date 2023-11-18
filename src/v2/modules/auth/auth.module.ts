import { JwtStrategy } from '@guards/jwt';
import { HeaderApiKeyStrategy } from '@guards/keys';
import { LocalStrategy } from '@guards/local';
import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ShippingRepository } from '@v2/shipping';
import { UserRepository } from '@v2/users';
import { UserService } from '@v2/users/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const configService = new ConfigService();

const services: Provider[] = [AuthService, UserService];
const strategies: Provider[] = [
  LocalStrategy,
  JwtStrategy,
  HeaderApiKeyStrategy,
];
const repositories: Provider[] = [UserRepository, ShippingRepository];
const controllers = [AuthController];

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configService.get('JWT_SECRET')!,
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRATION_TIME'),
      },
    }),
  ],
  controllers: [...controllers],
  providers: [...services, ...repositories, ...strategies],
})
export class AuthModule {}
