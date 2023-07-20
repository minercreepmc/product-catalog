import { V1UpdateProductHttpController } from '@controllers/http/v1';
import { UploadService } from '@infrastructures/cloud';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  UpdateProductHandler,
  UpdateProductValidator,
} from '@use-cases/command/update-product';

const useCase: Provider[] = [UpdateProductHandler, UpdateProductValidator];

const controllers = [V1UpdateProductHttpController];

const sharedModules = [CqrsModule, DomainServicesModule];

@Module({
  imports: [...sharedModules],
  controllers,
  providers: [...useCase, UploadService],
})
export class UpdateProductModule {}
