import { CommandHandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  CreateProductMapper,
  CreateProductProcess,
  CreateProductRequestValidator,
} from './application-services';
import { CreateProductRequestDto, CreateProductResponseDto } from './dtos';

@RequestHandler(CreateProductRequestDto)
export class CreateProductHandler extends CommandHandlerBase<
  CreateProductRequestDto,
  CreateProductResponseDto
> {
  constructor(
    validator: CreateProductRequestValidator,
    mapper: CreateProductMapper,
    process: CreateProductProcess,
  ) {
    super(validator, mapper, process);
  }
}
