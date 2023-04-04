import { ICommand } from '@nestjs/cqrs';

export class CreateReviewerCommand implements ICommand {
  readonly name: string;
  readonly email: string;
  constructor(dtos: CreateReviewerCommand) {
    this.name = dtos.name;
    this.email = dtos.email;
  }
}
