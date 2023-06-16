import { HandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  RejectProductMapper,
  RejectProductProcess,
  RejectProductValidator,
} from './application-services';
import { RejectProductRequestDto, RejectProductResponseDto } from './dtos';

@RequestHandler(RejectProductRequestDto)
export class RejectProductHandler extends HandlerBase<
  RejectProductRequestDto,
  RejectProductResponseDto
> {
  constructor(
    validator: RejectProductValidator,
    mapper: RejectProductMapper,
    rejectProductProcess: RejectProductProcess,
  ) {
    super(validator, mapper, rejectProductProcess);
  }
}
