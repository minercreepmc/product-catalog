import {
  RequestDtoBase,
  UseCaseProcessExceptions,
  UseCaseRequestValidationExceptions,
} from '@base/use-cases';
import {
  Put,
  UseInterceptors,
  Body,
  UploadedFile,
  Param,
  UnprocessableEntityException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { Mediator } from 'nestjs-mediator';
import { match } from 'oxide.ts';

export abstract class HttpFilePutController<THttpRequest, THttpResponse> {
  constructor(protected readonly mediator: Mediator) {}

  @Put()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async execute(
    @Body() httpRequest: any,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const dto = this.createDto(httpRequest, file, id);

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
    file?: Express.Multer.File,
    id?: string,
  ): RequestDtoBase<any>;
  abstract createHttpResponse(response: any): THttpResponse;
}
