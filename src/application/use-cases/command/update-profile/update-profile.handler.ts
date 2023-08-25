import { CommandHandlerBase } from '@base/use-cases';
import { ProfileUpdatedDomainEvent } from '@domain-events/user';
import { UserRegistrationDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import {
  UpdateProfileCommand,
  UpdateProfileResponseDto,
} from './update-profile.dto';
import {
  UpdateProfileFailure,
  UpdateProfileSuccess,
} from './update-profile.result';
import { UpdateProfileValidator } from './update-profile.validator';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler extends CommandHandlerBase<
  UpdateProfileCommand,
  UpdateProfileSuccess,
  UpdateProfileFailure
> {
  constructor(
    private readonly userRegistrationService: UserRegistrationDomainService,
    validator: UpdateProfileValidator,
  ) {
    super(validator);
  }
  protected command: UpdateProfileCommand;
  handle(): Promise<ProfileUpdatedDomainEvent> {
    return this.userRegistrationService.updateProfile({
      id: this.command.id,
      payload: {
        address: this.command.address,
        fullName: this.command.fullName,
      },
    });
  }
  async toResponseDto(
    data: ProfileUpdatedDomainEvent,
  ): Promise<UpdateProfileResponseDto> {
    return new UpdateProfileResponseDto({
      fullName: data.fullName?.value,
      address: data.address?.value,
      id: data.id.value,
    });
  }
}
