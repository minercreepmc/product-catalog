import { CommandHandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  DetachSubCategoriesMapper,
  DetachSubCategoriesProcess,
  DetachSubCategoriesRequestValidator,
} from './application-serivces';
import {
  DetachSubCategoriesRequestDto,
  DetachSubCategoriesResponseDto,
} from './dtos/detach-sub-categories.dto';

@RequestHandler(DetachSubCategoriesRequestDto)
export class DetachSubCategoriesHandler extends CommandHandlerBase<
  DetachSubCategoriesRequestDto,
  DetachSubCategoriesResponseDto
> {
  constructor(
    validator: DetachSubCategoriesRequestValidator,
    mapper: DetachSubCategoriesMapper,
    process: DetachSubCategoriesProcess,
  ) {
    super(validator, mapper, process);
  }
}
