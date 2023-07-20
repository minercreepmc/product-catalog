import { CategoryManagementDomainService } from '@domain-services';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DefaultCatch } from 'catch-decorator-ts';
import { Err, Ok } from 'oxide.ts';
import {
  RemoveCategoriesCommand,
  RemoveCategoriesResponseDto,
} from './remove-categories.dto';
import {
  RemoveCategoriesResult,
  RemoveCategoriesValidator,
} from './remove-categories.validator';

@CommandHandler(RemoveCategoriesCommand)
export class RemoveCategoriesHandler
  implements ICommandHandler<RemoveCategoriesCommand, RemoveCategoriesResult>
{
  @DefaultCatch((err) => Err(err))
  async execute(
    command: RemoveCategoriesCommand,
  ): Promise<RemoveCategoriesResult> {
    const result = await this.validator.validate(command);

    if (result.hasExceptions()) {
      return Err(result.getExceptions());
    }

    const categoriesRemoved =
      await this.categoryManagementService.removeCategories({
        categoryIds: command.ids,
      });

    return Ok(
      new RemoveCategoriesResponseDto({
        ids: categoriesRemoved.map((event) => event.id.value),
      }),
    );
  }

  constructor(
    private readonly validator: RemoveCategoriesValidator,
    private readonly categoryManagementService: CategoryManagementDomainService,
  ) {}
}
