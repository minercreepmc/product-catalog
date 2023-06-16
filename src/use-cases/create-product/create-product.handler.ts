import { HandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  CreateProductMapper,
  CreateProductProcess,
  CreateProductValidator,
} from './application-services';
import { CreateProductRequestDto, CreateProductResponseDto } from './dtos';

@RequestHandler(CreateProductRequestDto)
export class CreateProductHandler extends HandlerBase<
  CreateProductRequestDto,
  CreateProductResponseDto
> {
  constructor(
    validator: CreateProductValidator,
    mapper: CreateProductMapper,
    process: CreateProductProcess,
  ) {
    super(validator, mapper, process);
  }
}
