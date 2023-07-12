import { CommandHandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  RemoveReviewerMapper,
  RemoveReviewerProcess,
  RemoveReviewerRequestValidator,
} from './application-services';
import { RemoveReviewerRequestDto, RemoveReviewerResponseDto } from './dtos';

@RequestHandler(RemoveReviewerRequestDto)
export class RemoveReviewerHandler extends CommandHandlerBase<
  RemoveReviewerRequestDto,
  RemoveReviewerResponseDto
> {
  constructor(
    validator: RemoveReviewerRequestValidator,
    mapper: RemoveReviewerMapper,
    process: RemoveReviewerProcess,
  ) {
    super(validator, mapper, process);
  }
}
