import { CategoryManagementDomainService } from '@domain-services';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DefaultCatch } from 'catch-decorator-ts';
import { Err, Ok } from 'oxide.ts';
import {
  CreateCategoryCommand,
  CreateCategoryResponseDto,
} from './create-category.dto';
import {
  CreateCategoryResult,
  CreateCategoryValidator,
} from './create-category.validator';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand, CreateCategoryResult>
{
  @DefaultCatch((err) => Err(err))
  async execute(command: CreateCategoryCommand): Promise<CreateCategoryResult> {
    const result = await this.validator.validate(command);

    if (result.hasExceptions()) {
      return Err(result.getExceptions());
    }

    const categoryCreated = await this.categoryManagementService.createCategory(
      {
        name: command.name,
        description: command.description,
      },
    );

    return Ok(
      new CreateCategoryResponseDto({
        id: categoryCreated.id.value,
        name: categoryCreated.name.value,
        description: categoryCreated.description.value,
      }),
    );
  }

  constructor(
    private readonly validator: CreateCategoryValidator,
    private readonly categoryManagementService: CategoryManagementDomainService,
  ) {}
}
