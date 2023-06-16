import {
  RequestDtoBase,
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@base/use-cases';
import {
  Body,
  ConflictException,
  InternalServerErrorException,
  Param,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Mediator } from 'nestjs-mediator';
import { match } from 'oxide.ts';

export abstract class HttpPostControllerBase<THttpRequest, THttpResponse> {
  constructor(private readonly mediator: Mediator) {}

  @Post()
  async execute(@Body() httpRequest: any): Promise<any> {
    const dto = this.createDto(httpRequest);

    const result = await this.mediator.send(dto);

    return match(result, {
      Ok: (response: any) => {
        return this.createHttpResponse(response);
      },
      Err: (exception: Error) => {
        if (exception instanceof UseCaseCommandValidationExceptions) {
          throw new UnprocessableEntityException(exception.exceptions);
        }
        if (exception instanceof UseCaseProcessExceptions) {
          throw new ConflictException(exception.exceptions);
        }
        throw new InternalServerErrorException(exception);
      },
    });
  }

  abstract createDto(httpRequest: THttpRequest): RequestDtoBase<any>;
  abstract createHttpResponse(response: any): THttpResponse;
}
