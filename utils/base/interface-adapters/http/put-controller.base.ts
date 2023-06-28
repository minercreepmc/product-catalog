import {
  RequestDtoBase,
  UseCaseRequestValidationExceptions,
  UseCaseProcessExceptions,
} from '@base/use-cases';
import {
  Body,
  ConflictException,
  InternalServerErrorException,
  Param,
  Put,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Mediator } from 'nestjs-mediator';
import { match } from 'oxide.ts';

export abstract class HttpPutControllerBase<THttpRequest, THttpResponse> {
  constructor(private readonly mediator: Mediator) {}

  @Put()
  async execute(
    @Body() httpRequest: THttpRequest,
    @Param('id') id: string,
  ): Promise<any> {
    const dto = this.createDto(httpRequest, id);

    const result = await this.mediator.send(dto);

    return match(result, {
      Ok: (response: any) => {
        return this.createHttpResponse(response);
      },
      Err: (exception: Error) => {
        if (exception instanceof UseCaseRequestValidationExceptions) {
          throw new UnprocessableEntityException(exception.exceptions);
        }
        if (exception instanceof UseCaseProcessExceptions) {
          throw new ConflictException(exception.exceptions);
        }
        throw new InternalServerErrorException(exception);
      },
    });
  }

  abstract createDto(
    httpRequest: THttpRequest,
    id?: string,
  ): RequestDtoBase<any>;
  abstract createHttpResponse(response: any): THttpResponse;
}
