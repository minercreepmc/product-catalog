import { IRequestHandler, Request } from 'nestjs-mediator';
import { Err, Ok, Result } from 'oxide.ts';
import { QueryResponseResult } from '../dto.base';
import { UseCaseRequestValidationExceptions } from '../use-case-exceptions.base';
import { RequestValidatorBase } from '../validator';
import { QueryBase } from './query.dto';

export abstract class QueryHandlerBase<
  RequestDto extends Request<any>,
  ResponseDto,
> implements IRequestHandler<RequestDto, QueryResponseResult<ResponseDto>>
{
  constructor(private readonly validator?: RequestValidatorBase) {}

  async handle(
    dto: RequestDto,
  ): Promise<Result<ResponseDto, UseCaseRequestValidationExceptions>> {
    if (this.validator) {
      const dtoValidated = this.validator.validate(dto);

      if (!dtoValidated.isValid) {
        return Err(
          new UseCaseRequestValidationExceptions(dtoValidated.exceptions),
        );
      }

      const query = this.toQuery(dto);

      return Ok(await this.query(query));
    }
  }

  abstract toQuery(dto: any): QueryBase<any>;
  abstract query(query: QueryBase<any>): Promise<ResponseDto>;
}
