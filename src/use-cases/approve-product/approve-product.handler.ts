import { HandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  ApproveProductMapper,
  ApproveProductProcess,
  ApproveProductValidator,
} from './application-services';
import { ApproveProductRequestDto, ApproveProductResponseDto } from './dtos';

@RequestHandler(ApproveProductRequestDto)
export class ApproveProductHandler extends HandlerBase<
  ApproveProductRequestDto,
  ApproveProductResponseDto
> {
  constructor(
    validator: ApproveProductValidator,
    mapper: ApproveProductMapper,
    process: ApproveProductProcess,
  ) {
    super(validator, mapper, process);
  }
}
