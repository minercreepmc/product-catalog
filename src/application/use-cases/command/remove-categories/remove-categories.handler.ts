import { CommandHandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  RemoveCategoriesMapper,
  RemoveCategoriesProcess,
  RemoveCategoriesRequestValidator,
} from './application-services';
import {
  RemoveCategoriesRequestDto,
  RemoveCategoriesResponseDto,
} from './dtos/remove-category.dto';

@RequestHandler(RemoveCategoriesRequestDto)
export class RemoveCategoriesHandler extends CommandHandlerBase<
  RemoveCategoriesRequestDto,
  RemoveCategoriesResponseDto
> {
  constructor(
    validator: RemoveCategoriesRequestValidator,
    mapper: RemoveCategoriesMapper,
    process: RemoveCategoriesProcess,
  ) {
    super(validator, mapper, process);
  }
}
