import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import HealthModule from './modules/infrastructures/health-check/health.module';
import { UseCaseModule } from './modules/application/use-cases';
import { DatabaseModule } from '@modules/infrastructures/database';
import { databaseConfig } from '@config/pg';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule,
    UseCaseModule,
    DatabaseModule.forRoot(databaseConfig),
    HealthModule,
  ],
})
export class AppModule {}
