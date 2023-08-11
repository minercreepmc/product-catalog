import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import { UserIdValueObject } from '@value-objects/user';

export class CreateCartCommand implements CommandBase {
  userId: UserIdValueObject;

  constructor(options: CreateCartCommand) {
    this.userId = options.userId;
  }

  validate?(): DomainExceptionBase[] {
    return [this.userId.validate()].filter((e) => e);
  }
}

export class CreateCartResponseDto {
  id: string;
  userId: string;

  constructor(options: CreateCartResponseDto) {
    this.id = options.id;
    this.userId = options.userId;
  }
}
