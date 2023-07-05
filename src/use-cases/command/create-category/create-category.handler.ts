import { CommandHandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  CreateCategoryMapper,
  CreateCategoryProcess,
  CreateCategoryRequestValidator,
} from './application-services';
import { CreateCategoryRequestDto, CreateCategoryResponseDto } from './dtos';

@RequestHandler(CreateCategoryRequestDto)
export class CreateCategoryHandler extends CommandHandlerBase<
  CreateCategoryRequestDto,
  CreateCategoryResponseDto
> {
  constructor(
    validator: CreateCategoryRequestValidator,
    mapper: CreateCategoryMapper,
    process: CreateCategoryProcess,
  ) {
    super(validator, mapper, process);
  }
}
