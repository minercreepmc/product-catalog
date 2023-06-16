import { HandlerBase } from '@utils/base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  CreateReviewerProcess,
  CreateReviewerValidator,
} from './application-services';
import { CreateReviewerMapper } from './application-services/create-reviewer.mapper';
import { CreateReviewerRequestDto, CreateReviewerResponseDto } from './dtos';

@RequestHandler(CreateReviewerRequestDto)
export class CreateReviewerHandler extends HandlerBase<
  CreateReviewerRequestDto,
  CreateReviewerResponseDto
> {
  constructor(
    validator: CreateReviewerValidator,
    mapper: CreateReviewerMapper,
    process: CreateReviewerProcess,
  ) {
    super(validator, mapper, process);
  }
}
