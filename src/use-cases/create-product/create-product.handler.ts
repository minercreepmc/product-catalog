import { HandlerBase } from '@base/use-cases';
import { ProductRequestValidator } from '@use-cases/application-services/validators';
import { RequestHandler } from 'nestjs-mediator';
import {
  CreateProductMapper,
  CreateProductProcess,
} from './application-services';
import { CreateProductRequestDto, CreateProductResponseDto } from './dtos';

@RequestHandler(CreateProductRequestDto)
export class CreateProductHandler extends HandlerBase<
  CreateProductRequestDto,
  CreateProductResponseDto
> {
  constructor(
    validator: ProductRequestValidator,
    mapper: CreateProductMapper,
    process: CreateProductProcess,
  ) {
    super(validator, mapper, process);
  }
}
