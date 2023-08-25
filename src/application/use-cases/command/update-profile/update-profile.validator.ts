import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { Injectable } from '@nestjs/common';
import { UpdateProfileCommand } from './update-profile.dto';
import { UpdateProfileFailure } from './update-profile.result';

@Injectable()
export class UpdateProfileValidator extends ValidatorBase<
  UpdateProfileCommand,
  UpdateProfileFailure
> {
  command: UpdateProfileCommand;
  async validate(
    command: UpdateProfileCommand,
  ): Promise<Notification<UpdateProfileFailure>> {
    this.command = command;
    const note = new Notification<UpdateProfileFailure>();

    return note;
  }
}
