import {
  Body,
  ConflictException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
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
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import { MultipleExceptions } from '@base/domain';
import { CategoryIdValueObject } from '@value-objects/category';
import { DiscountIdValueObject } from '@value-objects/discount';
import {
  v1ApiEndpoints,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
} from '@api/http';

@Controller(v1ApiEndpoints.createProduct)
export class V1CreateProductHttpController extends HttpControllerBase<
  V1CreateProductHttpRequest,
  CreateProductCommand,
  V1CreateProductHttpResponse
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
    const { name, description, price, categoryIds, discountId } = request!;
    return new CreateProductCommand({
      name: new ProductNameValueObject(name),
      price: new ProductPriceValueObject(Number(price)),
      description: description
        ? new ProductDescriptionValueObject(description)
        : undefined,
      image:
        image &&
        new FileValueObject({
          name: image?.originalname,
          value: image?.buffer,
        }),
      categoryIds:
        categoryIds &&
        categoryIds?.map?.((id) => new CategoryIdValueObject(id)),
      discountId: discountId
        ? new DiscountIdValueObject(discountId)
        : undefined,
    });
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
