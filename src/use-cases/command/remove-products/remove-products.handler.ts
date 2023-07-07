import { CommandHandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  RemoveProductsMapper,
  RemoveProductsProcess,
  RemoveProductsRequestValidator,
} from './application-services';
import { RemoveProductsRequestDto, RemoveProductsResponseDto } from './dtos';

@RequestHandler(RemoveProductsRequestDto)
export class RemoveProductsHandler extends CommandHandlerBase<
  RemoveProductsRequestDto,
  RemoveProductsResponseDto
> {
  constructor(
    validator: RemoveProductsRequestValidator,
    mapper: RemoveProductsMapper,
    process: RemoveProductsProcess,
  ) {
    super(validator, mapper, process);
  }
}
