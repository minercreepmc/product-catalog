import mikroOrmConfig from '@config/mikroorm/mikrorm.config';
import { CategoryMikroOrmRepository } from '@database/repositories/mikroorm/category';
import { ProductMikroOrmRepository } from '@database/repositories/mikroorm/product';
import { ReviewerMikroOrmRepository } from '@database/repositories/mikroorm/reviewer';
import {
  categoryRepositoryDiToken,
  productRepositoryDiToken,
  reviewerRepositoryDiToken,
} from '@domain-interfaces';
import { unitOfWorkDiToken } from '@domain-interfaces/unit-of-work.interface';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, Provider } from '@nestjs/common';
import { MikroOrmUnitOfWork } from '@utils/base/database/unit-of-work';

const repositories: Provider[] = [
  {
    provide: categoryRepositoryDiToken,
    useClass: CategoryMikroOrmRepository,
  },
  {
    provide: productRepositoryDiToken,
    useClass: ProductMikroOrmRepository,
  },
  {
    provide: reviewerRepositoryDiToken,
    useClass: ReviewerMikroOrmRepository,
  },
  {
    provide: unitOfWorkDiToken,
    useClass: MikroOrmUnitOfWork,
  },
];

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig)],
  providers: [...repositories],
  exports: [...repositories],
})
export class DatabaseModule {}
