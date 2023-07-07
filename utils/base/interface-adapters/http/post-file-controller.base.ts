import {
  RequestDtoBase,
  UseCaseProcessExceptions,
  UseCaseRequestValidationExceptions,
} from '@base/use-cases';
import {
  Body,
  ConflictException,
  InternalServerErrorException,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { Mediator } from 'nestjs-mediator';
import { match } from 'oxide.ts';
import { Express } from 'express';
import { Multer } from 'multer';

export abstract class HttpFilePostController<THttpRequest, THttpResponse> {
  constructor(protected readonly mediator: Mediator) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async execute(
    @UploadedFile() file: Express.Multer.File,
    @Body() httpRequest: any,
  ): Promise<any> {
    const dto = this.createDto(httpRequest, file);

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
    file: Express.Multer.File,
  ): RequestDtoBase<any>;
  abstract createHttpResponse(response: any): THttpResponse;
}
