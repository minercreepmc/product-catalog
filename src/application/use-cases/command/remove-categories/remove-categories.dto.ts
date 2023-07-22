import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { CategoryIdValueObject } from '@value-objects/category';
import { ArrayNotEmpty, IsArray, validateSync } from 'class-validator';
export class RemoveCategoriesCommand implements CommandBase {
  @IsArray()
  @ArrayNotEmpty()
  readonly ids: CategoryIdValueObject[];

  validate?(): DomainExceptionBase[] {
    let isValid: boolean;

    if (validateSync(this).length > 0) {
      isValid = false;
    }

    let exception: DomainExceptionBase;

    isValid = !this.ids.some((id) => {
      exception = id.validate();
      if (exception) return true;
      return false;
    });

    if (!isValid) {
      return [new CategoryDomainExceptions.IdDoesNotValid()];
    } else {
      return [];
    }
  }

  constructor(options: RemoveCategoriesCommand) {
    this.ids = options.ids;
  }
}

export class RemoveCategoriesResponseDto {
  readonly ids: string[];

  constructor(options: RemoveCategoriesResponseDto) {
    this.ids = options.ids;
  }
}
