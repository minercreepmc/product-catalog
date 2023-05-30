import { ApproveProductHttpController } from '@controllers/http';
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
import { ApproveProductHandler } from '@use-cases/approve-product';
import {
  ApproveProductMapper,
  ApproveProductProcess,
  ApproveProductValidator,
} from '@use-cases/approve-product/application-services';

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

const useCases: Provider[] = [
  ApproveProductHandler,
  ApproveProductValidator,
  ApproveProductProcess,
  ApproveProductMapper,
];

const controllers = [ApproveProductHttpController];

const vendors = [
  TypeOrmModule.forFeature([ProductTypeOrmModel, ReviewerTypeOrmModel]),
  CqrsModule,
];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...useCases, ...repositories],
})
export class ApproveProductModule {}
