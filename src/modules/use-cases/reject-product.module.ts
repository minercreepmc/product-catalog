import { RejectProductHttpController } from '@controllers/http';
import {
  ProductTypeOrmModel,
  ProductTypeOrmRepository,
} from '@database/repositories/typeorm/product';
import {
  ReviewerTypeOrmModel,
  ReviewerTypeOrmRepository,
} from '@database/repositories/typeorm/reviewer';
import {
  productRepositoryDiToken,
  reviewerRepositoryDiToken,
} from '@domain-interfaces';
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RejectProductHandler } from '@use-cases/reject-product';
import {
  RejectProductMapper,
  RejectProductProcess,
  RejectProductValidator,
} from '@use-cases/reject-product/application-services';

const repositories: Provider[] = [
  {
    provide: productRepositoryDiToken,
    useClass: ProductTypeOrmRepository,
  },
  {
    provide: reviewerRepositoryDiToken,
    useClass: ReviewerTypeOrmRepository,
  },
];

const domainServices: Provider[] = [
  ProductManagementDomainService,
  ReviewerManagementDomainService,
  ProductApprovalDomainService,
];

const applicationServices: Provider[] = [
  RejectProductHandler,
  RejectProductValidator,
  RejectProductProcess,
  RejectProductMapper,
];

const controllers = [RejectProductHttpController];

const vendors = [
  TypeOrmModule.forFeature([ProductTypeOrmModel, ReviewerTypeOrmModel]),
  CqrsModule,
];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...repositories, ...domainServices, ...applicationServices],
})
export class RejectProductModule {}
