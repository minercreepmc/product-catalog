import { CommandHandlerBase } from '@base/use-cases';
import { RequestHandler } from 'nestjs-mediator';
import {
  SubmitForApprovalRequestValidator,
  SubmitForApprovalMapper,
  SubmitForApprovalProcess,
} from './application-services';
import {
  SubmitForApprovalRequestDto,
  SubmitForApprovalResponseDto,
} from './dtos';

@RequestHandler(SubmitForApprovalRequestDto)
export class SubmitForApprovalHandler extends CommandHandlerBase<
  SubmitForApprovalRequestDto,
  SubmitForApprovalResponseDto
> {
  constructor(
    validator: SubmitForApprovalRequestValidator,
    mapper: SubmitForApprovalMapper,
    process: SubmitForApprovalProcess,
  ) {
    super(validator, mapper, process);
  }
}
