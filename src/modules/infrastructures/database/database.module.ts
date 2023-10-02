import { readonlyCategoryRepositoryDiToken } from '@application/interface/category';
import { readOnlyDiscountRepositoryDiToken } from '@application/interface/discount';
import { readonlyOrderRepositoryDiToken } from '@application/interface/order';
import {
  readOnlyCartRepositoryDiToken,
  readOnlyProductRepositoryDiToken,
} from '@application/interface/product';
import { UnitOfWork } from '@base/database/unit-of-work';
import {
  ConfigurableDatabaseModule,
  CONNECTION_POOL,
  DatabaseConfigOptions,
  DatabaseService,
  DATABASE_OPTIONS,
} from '@config/database';
import {
  CartItemRepository,
  CartItemSchemaMapper,
  CartRepository,
  CartSchemaMapper,
  ReadOnlyCartRepository,
} from '@database/repositories/pg/cart';
import {
  CategoryRepository,
  CategorySchemaMapper,
  ReadOnlyCategoryRepository,
} from '@database/repositories/pg/category';
import {
  DiscountRepository,
  DiscountSchemaMapper,
  ReadOnlyDiscountRepository,
} from '@database/repositories/pg/discount';
import {
  OrderRepository,
  OrderSchemaMapper,
  ReadOnlyOrderRepository,
} from '@database/repositories/pg/order';
import {
  ProductRepository,
  ProductSchemaMapper,
  ReadOnlyProductRepository,
} from '@database/repositories/pg/product';
import {
  cartRepositoryDiToken,
  categoryRepositoryDiToken,
  discountRepositoryDiToken,
  productRepositoryDiToken,
} from '@domain-interfaces';
import { unitOfWorkDiToken } from '@domain-interfaces';
import { orderRepositoryDiToken } from '@domain-interfaces/database/order-repository.interface';
import { Global, Module, Provider } from '@nestjs/common';
import { UserRepository } from '@v2/users';
import { Pool } from 'pg';

const repositories: Provider[] = [
  {
    provide: categoryRepositoryDiToken,
    useClass: CategoryRepository,
  },
  {
    provide: productRepositoryDiToken,
    useClass: ProductRepository,
  },
  {
    provide: discountRepositoryDiToken,
    useClass: DiscountRepository,
  },
  UserRepository,
  {
    provide: readOnlyProductRepositoryDiToken,
    useClass: ReadOnlyProductRepository,
  },
  {
    provide: readonlyCategoryRepositoryDiToken,
    useClass: ReadOnlyCategoryRepository,
  },
  {
    provide: cartRepositoryDiToken,
    useClass: CartRepository,
  },
  CartItemRepository,
  {
    provide: unitOfWorkDiToken,
    useClass: UnitOfWork,
  },
  {
    provide: readOnlyCartRepositoryDiToken,
    useClass: ReadOnlyCartRepository,
  },
  {
    provide: orderRepositoryDiToken,
    useClass: OrderRepository,
  },
  {
    provide: readonlyOrderRepositoryDiToken,
    useClass: ReadOnlyOrderRepository,
  },
  {
    provide: readOnlyDiscountRepositoryDiToken,
    useClass: ReadOnlyDiscountRepository,
  },
];

const poolProvider: Provider = {
  provide: CONNECTION_POOL,
  inject: [DATABASE_OPTIONS],
  useFactory: (databaseOptions: DatabaseConfigOptions) => {
    return new Pool({
      host: databaseOptions.host,
      port: databaseOptions.port,
      user: databaseOptions.user,
      password: databaseOptions.password,
      database: databaseOptions.database,
    });
  },
};

const mappers: Provider[] = [
  ProductSchemaMapper,
  CategorySchemaMapper,
  DiscountSchemaMapper,
  CartSchemaMapper,
  CartItemSchemaMapper,
  OrderSchemaMapper,
];

@Module({
  imports: [],
  providers: [...repositories, DatabaseService, poolProvider, ...mappers],
  exports: [...repositories, DatabaseService],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
