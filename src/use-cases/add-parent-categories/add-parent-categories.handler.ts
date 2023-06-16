import { HandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  AddParentCategoriesMapper,
  AddParentCategoriesProcess,
  AddParentCategoriesValidator,
} from './application-services';
import {
  AddParentCategoriesRequestDto,
  AddParentCategoriesResponseDto,
} from './dtos';

@RequestHandler(AddParentCategoriesRequestDto)
export class AddParentCategoriesHandler extends HandlerBase<
  AddParentCategoriesRequestDto,
  AddParentCategoriesResponseDto
> {
  constructor(
    validator: AddParentCategoriesValidator,
    mapper: AddParentCategoriesMapper,
    process: AddParentCategoriesProcess,
  ) {
    super(validator, mapper, process);
  }
}
