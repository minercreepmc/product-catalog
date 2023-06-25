import { HandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  AddSubCategoriesMapper,
  AddSubCategoriesProcess,
  AddSubCategoriesRequestValidator,
} from './application-services';
import {
  AddSubCategoriesRequestDto,
  AddSubCategoriesResponseDto,
} from './dtos';

@RequestHandler(AddSubCategoriesRequestDto)
export class AddSubCategoriesHandler extends HandlerBase<
  AddSubCategoriesRequestDto,
  AddSubCategoriesResponseDto
> {
  constructor(
    validator: AddSubCategoriesRequestValidator,
    mapper: AddSubCategoriesMapper,
    process: AddSubCategoriesProcess,
  ) {
    super(validator, mapper, process);
  }
}
