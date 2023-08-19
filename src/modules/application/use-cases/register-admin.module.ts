import { V1RegisterAdminHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  RegisterAdminHandler,
  RegisterAdminValidator,
} from '@use-cases/command/register-admin';

const commandHandler: Provider[] = [
  RegisterAdminHandler,
  RegisterAdminValidator,
];

const controllers = [V1RegisterAdminHttpController];

const sharedModules = [DomainServicesModule, CqrsModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...commandHandler],
})
export class RegisterAdminModule {}
