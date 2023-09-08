import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import { CategoryIdValueObject } from '@value-objects/category';

export class RemoveCategoryCommand implements CommandBase {
  id: CategoryIdValueObject;

  validate?() {
    return [this.id.validate?.()].filter((e) => e) as DomainExceptionBase[];
  }

  constructor(options: RemoveCategoryCommand) {
    this.id = options.id;
  }
}

export class RemoveCategoryResponseDto {
  id: string;

  constructor(options: RemoveCategoryResponseDto) {
    this.id = options.id;
  }
}
