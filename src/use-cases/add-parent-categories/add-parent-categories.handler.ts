import { HandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  AddParentCategoriesMapper,
  AddParentCategoriesProcess,
  AddParentCategoriesRequestValidator,
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
    validator: AddParentCategoriesRequestValidator,
    mapper: AddParentCategoriesMapper,
    process: AddParentCategoriesProcess,
  ) {
    super(validator, mapper, process);
  }
}
