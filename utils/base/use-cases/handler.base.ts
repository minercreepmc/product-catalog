import { IRequestHandler, Request } from 'nestjs-mediator';
import { Err, Ok } from 'oxide.ts';
import { ResponseResult } from './dto.base';
import { ProcessBase } from './process.base';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from './use-case-exceptions.base';
import { UseCaseMapperBase } from './use-case-mapper.base';
import { ValidatorBase } from './validator.base';

export abstract class HandlerBase<RequestDto extends Request<any>, ResponseDto>
  implements IRequestHandler<RequestDto, ResponseResult<ResponseDto>>
{
  constructor(
    private readonly validator: ValidatorBase | null,
    private readonly mapper: UseCaseMapperBase<ResponseDto>,
    private readonly process: ProcessBase<any, any>,
  ) {}

  async handle(dto: RequestDto) {
    if (this.validator) {
      const dtoValidated = this.validator.validate(dto);

      if (!dtoValidated.isValid) {
        return Err(
          new UseCaseCommandValidationExceptions(dtoValidated.exceptions),
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
