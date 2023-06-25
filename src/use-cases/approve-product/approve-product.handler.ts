import { HandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  ApproveProductMapper,
  ApproveProductProcess,
  ApproveProductRequestValidator,
} from './application-services';
import { ApproveProductRequestDto, ApproveProductResponseDto } from './dtos';

@RequestHandler(ApproveProductRequestDto)
export class ApproveProductHandler extends HandlerBase<
  ApproveProductRequestDto,
  ApproveProductResponseDto
> {
  constructor(
    validator: ApproveProductRequestValidator,
    mapper: ApproveProductMapper,
    process: ApproveProductProcess,
  ) {
    super(validator, mapper, process);
  }
}
