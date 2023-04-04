import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/common/infrastructure/database';
import { ProductModule } from './core/product';
import { ReviewerModule } from './core/reviewer/reviewer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProductModule,
    ReviewerModule,
  ],
})
export class AppModule {}
