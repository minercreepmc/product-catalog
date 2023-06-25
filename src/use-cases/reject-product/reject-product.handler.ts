import { HandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  RejectProductMapper,
  RejectProductProcess,
  RejectProductRequestValidator,
} from './application-services';
import { RejectProductRequestDto, RejectProductResponseDto } from './dtos';

@RequestHandler(RejectProductRequestDto)
export class RejectProductHandler extends HandlerBase<
  RejectProductRequestDto,
  RejectProductResponseDto
> {
  constructor(
    validator: RejectProductRequestValidator,
    mapper: RejectProductMapper,
    rejectProductProcess: RejectProductProcess,
  ) {
    super(validator, mapper, rejectProductProcess);
  }
}
