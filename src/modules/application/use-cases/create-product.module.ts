import { V1CreateProductHttpController } from '@controllers/http/v1';
import { UploadService } from '@infrastructures/cloud';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CreateProductHandler,
  CreateProductValidator,
} from '@use-cases/command/create-product';

const commandHandler: Provider[] = [
  CreateProductHandler,
  CreateProductValidator,
];

const controllers = [V1CreateProductHttpController];
const sharedModules = [CqrsModule, DomainServicesModule];

@Module({
  imports: [...sharedModules],
  controllers,
  providers: [...commandHandler, UploadService],
})
export class CreateProductModule {}
