import { V1UpdateProfileHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  UpdateProfileHandler,
  UpdateProfileValidator,
} from '@use-cases/command/update-profile';

const useCase: Provider[] = [UpdateProfileHandler, UpdateProfileValidator];
const controllers = [V1UpdateProfileHttpController];
const sharedModules = [CqrsModule, DomainServicesModule];

@Module({
  imports: [...sharedModules],
  controllers,
  providers: [...useCase],
})
export class UpdateProfileModule {}
