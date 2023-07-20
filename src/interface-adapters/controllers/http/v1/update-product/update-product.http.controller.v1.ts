import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Param,
  Put,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { RemoveProductsResponseDto } from '@use-cases/command/remove-products';
import { UpdateProductCommand } from '@use-cases/command/update-product';
import { FileValueObject } from '@value-objects/file.value-object';
import {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { validate } from 'class-validator';
import { DomainExceptionBase } from 'common-base-classes';
import { match } from 'oxide.ts';
import { V1RemoveProductsHttpResponse } from '../remove-products';
import { V1UpdateProductHttpRequest } from './update-product.http.request.v1';

@Controller('/api/v1/products/:id/update')
export class V1UpdateProductHttpController {
  @Put()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async execute(
    @UploadedFile() image: Express.Multer.File,
    @Body() request: V1UpdateProductHttpRequest,
    @Param('id') id: string,
  ): Promise<any> {
    const { name, description, price } = request;
    const command = new UpdateProductCommand({
      id: new ProductIdValueObject(id),
      name: new ProductNameValueObject(name),
      description: new ProductDescriptionValueObject(description),
      image: new FileValueObject({
        name: image.originalname,
        value: image.buffer,
      }),
      price: new ProductPriceValueObject(price),
    });

    const exceptions = await validate(command);

    if (exceptions.length > 0) {
      throw new UnprocessableEntityException(exceptions);
    }

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: RemoveProductsResponseDto) =>
        new V1RemoveProductsHttpResponse(response),
      Err: (exception: Error) => {
        if (exception instanceof DomainExceptionBase) {
          throw new ConflictException(exception.message);
        }

        throw new InternalServerErrorException(exception.message);
      },
    });
  }

  constructor(private readonly commandBus: CommandBus) {}
}
