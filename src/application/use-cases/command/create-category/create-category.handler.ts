import { CommandHandlerBase } from '@base/use-cases/command-handler/command-handler.base';
import { CategoryCreatedDomainEvent } from '@domain-events/category';
import { CategoryManagementDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import {
  CreateCategoryCommand,
  CreateCategoryResponseDto,
} from './create-category.dto';
import {
  CreateCategoryFailure,
  CreateCategorySuccess,
  CreateCategoryValidator,
} from './create-category.validator';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler extends CommandHandlerBase<
  CreateCategoryCommand,
  CreateCategorySuccess,
  CreateCategoryFailure
> {
  handle(): Promise<CategoryCreatedDomainEvent> {
    return this.categoryManagementService.createCategory({
      name: this.command.name,
      description: this.command.description,
    });
  }
  toResponseDto(data: CategoryCreatedDomainEvent): any {
    return new CreateCategoryResponseDto({
      id: data.id?.value,
      name: data.name?.value,
      description: data.description?.value,
    });
  }

  protected command: any;
  constructor(
    validator: CreateCategoryValidator,
    private readonly categoryManagementService: CategoryManagementDomainService,
  ) {
    super(validator);
  }
}
