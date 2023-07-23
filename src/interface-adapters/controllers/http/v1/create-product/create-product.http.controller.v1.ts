import {
  Body,
  ConflictException,
  Controller,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { V1CreateProductHttpRequest } from './create-product.http.request.v1';
import { Express } from 'express';
import { Multer } from 'multer';
import {
  CreateProductCommand,
  CreateProductResponseDto,
} from '@use-cases/command/create-product';
import {
  ProductDescriptionValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { FileValueObject } from '@value-objects/file.value-object';
import { match } from 'oxide.ts';
import { V1CreateProductHttpResponse } from './create-product.http.response.v1';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import { MultipleExceptions } from '@base/domain';

@Controller('/api/v1/products/create')
export class V1CreateProductHttpController extends HttpControllerBase<
  V1CreateProductHttpRequest,
  CreateProductCommand,
  CreateProductResponseDto
> {
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  execute(
    @Body() request: V1CreateProductHttpRequest,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return super._execute({
      request,
      image,
    });
  }

  toCommand(
    options: HttpControllerBaseOption<V1CreateProductHttpRequest>,
  ): CreateProductCommand {
    const { request, image } = options;
    const { name, description, price } = request;
    return new CreateProductCommand({
      name: new ProductNameValueObject(name),
      price: new ProductPriceValueObject(Number(price)),
      description:
        description && new ProductDescriptionValueObject(description),
      image:
        image &&
        new FileValueObject({
          name: image?.originalname,
          value: image?.buffer,
        }),
    });
  }
  validate(command: CreateProductCommand): void {
    const exceptions = command.validate();

    if (exceptions.length > 0) {
      throw new UnprocessableEntityException(exceptions);
    }
  }
  extractResult(result: any): CreateProductResponseDto {
    return match(result, {
      Ok: (response: CreateProductResponseDto) =>
        new V1CreateProductHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }

        throw e;
      },
    });
  }

  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
}
