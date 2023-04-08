import { ICommand } from '@nestjs/cqrs';

export class CreateReviewerCommand implements ICommand {
  readonly name: string;
  readonly email: string;
  readonly role: string;
  constructor(dtos: CreateReviewerCommand) {
    this.name = dtos.name;
    this.email = dtos.email;
    this.role = dtos.role;
  }
}
