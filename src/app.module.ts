import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UserModule } from '@v2/users/user.module';
import { AuthModule } from '@v2/auth/auth.module';
import { ShippingFeeModule } from '@v2/shipping-fee';
import { DbValidatorsModule } from '@youba/nestjs-dbvalidator';
import { databaseConfig, DatabaseModule } from '@config/database';
import { AddressModule } from '@v2/address';
import { ShippingModule } from '@v2/shipping';
import { ProductModule } from '@v2/product';
import { CategoryModule } from '@v2/category';
import { DiscountModule } from '@v2/discount';
import { CartModule } from '@v2/cart';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  OrderCreatedModule,
  ShippingCreatedModule,
  ShippingDeletedModule,
  UserCreatedModule,
} from './v2/listeners';
import { CartItemModule } from '@v2/cart-item';
import { UploadModule } from '@v2/upload';
import { ProductImageModule } from '@v2/product-image';
import { OrderModule } from '@v2/order';
import { IncomeModule } from '@v2/income';
import { ShippingStatusModule } from '@v2/shipping-status';
import { OrderUpdatedModule } from './v2/listeners/order-updated';
import { OrderItemModule } from '@v2/order-item';
import { ProductCategoryModule } from '@v2/product-category';
import { ShippingMethodModule } from '@v2/shipping-method';

const modules = [
  UserModule,
  AuthModule,
  ShippingFeeModule,
  AddressModule,
  ShippingModule,
  ProductModule,
  CategoryModule,
  DiscountModule,
  CartModule,
  CartItemModule,
  UploadModule,
  ProductImageModule,
  OrderModule,
  IncomeModule,
  ShippingStatusModule,
  OrderItemModule,
  ProductCategoryModule,
  ShippingMethodModule,
];

const listeners = [
  UserCreatedModule,
  OrderCreatedModule,
  ShippingCreatedModule,
  ShippingDeletedModule,
  OrderUpdatedModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
    EventEmitterModule.forRoot(),
    DbValidatorsModule.register({
      host: databaseConfig.host,
      port: databaseConfig.port,
      type: 'postgres',
      database: databaseConfig.database,
      username: databaseConfig.user,
      password: databaseConfig.password,
    }),
    DatabaseModule.forRoot(databaseConfig),
    ...modules,
    ...listeners,
  ],
})
export class AppModule {}
