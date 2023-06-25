import { Module, Provider } from '@nestjs/common';
import { DomainServicesModule } from '@src/modules/domains';
import {
  ProductCommandValidator,
  ProductRequestValidator,
  ReviewerCommandValidator,
  ReviewerRequestValidator,
} from '@use-cases/application-services/validators';

const requestValidator: Provider[] = [
  ReviewerRequestValidator,
  ReviewerCommandValidator,
  ProductRequestValidator,
  ProductCommandValidator,
];

@Module({
  imports: [DomainServicesModule],
  providers: [...requestValidator],
  exports: [...requestValidator],
})
export class ApplicationServicesModule {}
