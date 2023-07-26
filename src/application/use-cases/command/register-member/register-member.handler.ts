import { CommandHandlerBase } from '@base/use-cases/command-handler/command-handler.base';
import { MemberRegisteredDomainEvent } from '@domain-events/user';
import { UserRegistrationDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import {
  RegisterMemberCommand,
  RegisterMemberResponseDto,
} from './register-member.dto';
import {
  RegisterMemberFailure,
  RegisterMemberSuccess,
} from './register-member.result';
import { RegisterMemberValidator } from './register-member.validator';

@CommandHandler(RegisterMemberCommand)
export class RegisterMemberHandler extends CommandHandlerBase<
  RegisterMemberCommand,
  RegisterMemberSuccess,
  RegisterMemberFailure
> {
  protected command: RegisterMemberCommand;
  handle(): Promise<MemberRegisteredDomainEvent> {
    return this.userRegistrationService.registerMember(this.command);
  }
  toResponseDto(data: MemberRegisteredDomainEvent): RegisterMemberResponseDto {
    return new RegisterMemberResponseDto({
      username: data.username?.value,
    });
  }

  constructor(
    validator: RegisterMemberValidator,
    private readonly userRegistrationService: UserRegistrationDomainService,
  ) {
    super(validator);
  }
}
