import { CommandHandlerBase } from '@base/use-cases/command-handler/command-handler.base';
import { AdminRegisteredDomainEvent } from '@domain-events/user';
import { UserRegistrationDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import {
  RegisterAdminCommand,
  RegisterAdminResponseDto,
} from './register-admin.dto';
import {
  RegisterAdminFailure,
  RegisterAdminSuccess,
} from './register-admin.result';
import { RegisterAdminValidator } from './register-admin.validator';

@CommandHandler(RegisterAdminCommand)
export class RegisterAdminHandler extends CommandHandlerBase<
  RegisterAdminCommand,
  RegisterAdminSuccess,
  RegisterAdminFailure
> {
  protected command: RegisterAdminCommand;
  handle(): Promise<AdminRegisteredDomainEvent> {
    return this.userRegistrationService.registerAdmin(this.command);
  }
  toResponseDto(data: AdminRegisteredDomainEvent): RegisterAdminResponseDto {
    return new RegisterAdminResponseDto({
      id: data.id?.value,
      username: data.username?.value,
      fullName: data.fullName?.value,
    });
  }

  constructor(
    validator: RegisterAdminValidator,
    private readonly userRegistrationService: UserRegistrationDomainService,
  ) {
    super(validator);
  }
}
