import { V1RegisterMemberHttpController } from '@controllers/http/v1/register-member';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  RegisterMemberHandler,
  RegisterMemberValidator,
} from '@use-cases/command/register-member';

const commandHandler: Provider[] = [
  RegisterMemberHandler,
  RegisterMemberValidator,
];

const controllers = [V1RegisterMemberHttpController];

const sharedModules = [DomainServicesModule, CqrsModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...commandHandler],
})
export class RegisterMemberModule {}
