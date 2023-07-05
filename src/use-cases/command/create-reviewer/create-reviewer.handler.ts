import {
  HandlerException,
  CommandResponseResult,
  UseCaseRequestValidationExceptions,
  UseCaseProcessExceptions,
} from '@utils/base/use-cases';
import { IRequestHandler, RequestHandler } from 'nestjs-mediator';
import { Err, Ok, Result } from 'oxide.ts';
import {
  CreateReviewerProcess,
  CreateReviewerRequestValidator,
} from './application-services';
import { CreateReviewerMapper } from './application-services/create-reviewer.mapper';
import { CreateReviewerRequestDto, CreateReviewerResponseDto } from './dtos';

@RequestHandler(CreateReviewerRequestDto)
export class CreateReviewerHandler
  implements
    IRequestHandler<
      CreateReviewerRequestDto,
      CommandResponseResult<CreateReviewerResponseDto>
    >
{
  constructor(
    private readonly validator: CreateReviewerRequestValidator,
    private readonly mapper: CreateReviewerMapper,
    private readonly process: CreateReviewerProcess,
  ) {}

  async handle(
    dto: CreateReviewerRequestDto,
  ): Promise<Result<CreateReviewerResponseDto, HandlerException>> {
    const dtoValidated = this.validator.validate(dto);

    if (!dtoValidated.isValid) {
      return Err(
        new UseCaseRequestValidationExceptions(dtoValidated.exceptions),
      );
    }

    const command = this.mapper.toCommand(dto);

    const processResult = await this.process.execute(command);

    if (processResult.isErr()) {
      return Err(new UseCaseProcessExceptions(processResult.unwrapErr()));
    }

    return Ok(this.mapper.toResponseDto(processResult.unwrap()));
  }
}
