import { IRequestHandler, Request } from 'nestjs-mediator';
import { Err, Ok, Result } from 'oxide.ts';
import { CommandResponseResult } from '../dto.base';
import { ProcessBase } from './process';
import {
  UseCaseProcessExceptions,
  UseCaseRequestValidationExceptions,
} from '../use-case-exceptions.base';
import { RequestValidatorBase } from '../validator';
import { CommandMapperBase } from './command-mapper.base';

export abstract class CommandHandlerBase<
  RequestDto extends Request<any>,
  ResponseDto,
> implements IRequestHandler<RequestDto, CommandResponseResult<ResponseDto>>
{
  constructor(
    private readonly validator: RequestValidatorBase | null,
    private readonly mapper: CommandMapperBase<ResponseDto>,
    private readonly process: ProcessBase<any, any>,
  ) {}

  async handle(
    dto: RequestDto,
  ): Promise<Result<ResponseDto, UseCaseProcessExceptions>> {
    if (this.validator) {
      const dtoValidated = this.validator.validate(dto);

      if (!dtoValidated.isValid) {
        return Err(
          new UseCaseRequestValidationExceptions(dtoValidated.exceptions),
        );
      }
    }

    const command = this.mapper.toCommand(dto);
    const processResult = await this.process.execute(command);

    if (processResult.isErr()) {
      return Err(new UseCaseProcessExceptions(processResult.unwrapErr()));
    }

    return Ok(this.mapper.toResponseDto(processResult.unwrap()));
  }
}
