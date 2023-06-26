import { Module, Provider } from '@nestjs/common';
import { DomainServicesModule } from '@modules/domains';
import {
  CategoryRequestValidator,
  ProductRequestValidator,
  ReviewerRequestValidator,
} from '@use-cases/application-services/validators';
import {
  CategoryBusinessEnforcer,
  ProductBusinessEnforcer,
  ReviewerBusinessEnforcer,
} from '@use-cases/application-services/process';

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

@Module({
  imports: [DomainServicesModule],
  providers: [...requestValidator, ...businessEnforcers],
  exports: [...requestValidator, ...businessEnforcers],
})
export class ApplicationServicesModule {}
