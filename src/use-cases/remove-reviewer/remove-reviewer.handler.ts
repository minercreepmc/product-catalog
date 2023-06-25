import { HandlerBase } from '@base/use-cases';
import { Injectable } from '@nestjs/common';
import {
  RemoveReviewerMapper,
  RemoveReviewerProcess,
  RemoveReviewerRequestValidator,
} from './application-services';
import { RemoveReviewerRequestDto, RemoveReviewerResponseDto } from './dtos';

@Injectable()
export class RemoveReviewerHandler extends HandlerBase<
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
