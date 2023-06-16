import { HandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  SubmitForApprovalValidator,
  SubmitForApprovalMapper,
  SubmitForApprovalProcess,
} from './application-services';
import {
  SubmitForApprovalRequestDto,
  SubmitForApprovalResponseDto,
} from './dtos';

@RequestHandler(SubmitForApprovalRequestDto)
export class SubmitForApprovalHandler extends HandlerBase<
  SubmitForApprovalRequestDto,
  SubmitForApprovalResponseDto
> {
  constructor(
    validator: SubmitForApprovalValidator,
    mapper: SubmitForApprovalMapper,
    process: SubmitForApprovalProcess,
  ) {
    super(validator, mapper, process);
  }
}
