import { HandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  UpdateProductProcess,
  UpdateProductRequestValidator,
} from './application-services';
import { UpdateProductMapper } from './application-services/update-product.mapper';
import { UpdateProductRequestDto, UpdateProductResponseDto } from './dtos';

@RequestHandler(UpdateProductRequestDto)
export class UpdateProductHandler extends HandlerBase<
  UpdateProductRequestDto,
  UpdateProductResponseDto
> {
  constructor(
    validator: UpdateProductRequestValidator,
    mapper: UpdateProductMapper,
    process: UpdateProductProcess,
  ) {
    super(validator, mapper, process);
  }
}
