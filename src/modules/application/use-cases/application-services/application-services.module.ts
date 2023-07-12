import { Module, Provider } from '@nestjs/common';
import { DomainServicesModule } from '@modules/domains';
import { UploadService } from '@infrastructures/cloud';
import {
  CategoryRequestValidator,
  ProductRequestValidator,
  ReviewerRequestValidator,
} from '@use-cases/shared/application-services/validators';
import {
  CategoryBusinessEnforcer,
  ProductBusinessEnforcer,
  ReviewerBusinessEnforcer,
} from '@use-cases/shared/application-services/process';

const requestValidator: Provider[] = [
  ReviewerRequestValidator,
  ProductRequestValidator,
  CategoryRequestValidator,
];

const businessEnforcers: Provider[] = [
  ReviewerBusinessEnforcer,
  ProductBusinessEnforcer,
  CategoryBusinessEnforcer,
];

const others: Provider[] = [UploadService];

@Module({
  imports: [DomainServicesModule],
  providers: [...requestValidator, ...businessEnforcers, ...others],
  exports: [...requestValidator, ...businessEnforcers, ...others],
})
export class ApplicationServicesModule {}
