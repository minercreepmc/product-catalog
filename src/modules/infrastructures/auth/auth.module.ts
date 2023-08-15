import {
  AuthApplicationService,
  LocalStrategy,
} from '@application/application-services/auth';
import { JwtStrategy } from '@application/application-services/auth/jwt.strategy';
import { authServiceDiToken } from '@domain-interfaces/services';
import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

const providers: Provider[] = [
  {
    provide: authServiceDiToken,
    useClass: AuthApplicationService,
  },
  AuthApplicationService,
  LocalStrategy,
  JwtStrategy,
];

const configService = new ConfigService();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRATION_TIME'),
      },
    }),
  ],
  providers: providers,
  exports: providers,
})
export class AuthModule {}
