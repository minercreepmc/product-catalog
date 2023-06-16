import { HandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  CreateCategoryMapper,
  CreateCategoryProcess,
  CreateCategoryValidator,
} from './application-services';
import { CreateCategoryRequestDto, CreateCategoryResponseDto } from './dtos';

@RequestHandler(CreateCategoryRequestDto)
export class CreateCategoryHandler extends HandlerBase<
  CreateCategoryRequestDto,
  CreateCategoryResponseDto
> {
  constructor(
    validator: CreateCategoryValidator,
    mapper: CreateCategoryMapper,
    process: CreateCategoryProcess,
  ) {
    super(validator, mapper, process);
  }
}
