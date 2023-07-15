import { CommandHandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  DetachParentCategoriesMapper,
  DetachParentCategoriesProcess,
  DetachParentCategoriesRequestValidator,
} from './application-serivces';
import {
  DetachParentCategoriesRequestDto,
  DetachParentCategoriesResponseDto,
} from './dtos';

@RequestHandler(DetachParentCategoriesRequestDto)
export class DetachParentCategoriesHandler extends CommandHandlerBase<
  DetachParentCategoriesRequestDto,
  DetachParentCategoriesResponseDto
> {
  constructor(
    validator: DetachParentCategoriesRequestValidator,
    mapper: DetachParentCategoriesMapper,
    process: DetachParentCategoriesProcess,
  ) {
    super(validator, mapper, process);
  }
}
