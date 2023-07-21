import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
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
import { validate } from 'class-validator';
import { match } from 'oxide.ts';
import { V1CreateProductHttpResponse } from './create-product.http.response.v1';

@Controller('/api/v1/products/create')
export class V1CreateProductHttpController {
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async execute(
    @UploadedFile() image: Express.Multer.File,
    @Body() request: V1CreateProductHttpRequest,
  ): Promise<any> {
    const { name, description, price } = request;
    const command = new CreateProductCommand({
      name: new ProductNameValueObject(name),
      description:
        description && new ProductDescriptionValueObject(description),
      image:
        image &&
        new FileValueObject({
          name: image?.originalname,
          value: image?.buffer,
        }),
      price: new ProductPriceValueObject(Number(price)),
    });

    const exceptions = command.validate();

    if (exceptions.length > 0) {
      throw new UnprocessableEntityException(exceptions);
    }

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: CreateProductResponseDto) =>
        new V1CreateProductHttpResponse(response),
      Err: (exception: Error) => {
        if ((exception as any)?.length > 0) {
          throw new ConflictException(exception);
        }

        throw new InternalServerErrorException(exception.message);
      },
    });
  }

  constructor(private readonly commandBus: CommandBus) {}
}
