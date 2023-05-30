import { SubmitForApprovalHttpController } from '@controllers/http';
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
import { SubmitForApprovalHandler } from '@use-cases/submit-for-approval';
import {
  SubmitForApprovalMapper,
  SubmitForApprovalProcess,
  SubmitForApprovalValidator,
} from '@use-cases/submit-for-approval/application-services';

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
  SubmitForApprovalHandler,
  SubmitForApprovalValidator,
  SubmitForApprovalProcess,
  SubmitForApprovalMapper,
];

const controllers = [SubmitForApprovalHttpController];

const vendors = [
  TypeOrmModule.forFeature([ProductTypeOrmModel, ReviewerTypeOrmModel]),
  CqrsModule,
];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...repositories, ...domainServices, ...useCases],
})
export class SubmitForApprovalModule {}
