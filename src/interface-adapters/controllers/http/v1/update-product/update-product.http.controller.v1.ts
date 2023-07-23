import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import {
  Body,
  ConflictException,
  Controller,
  Param,
  Put,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import {
  UpdateProductCommand,
  UpdateProductResponseDto,
} from '@use-cases/command/update-product';
import { DiscountIdValueObject } from '@value-objects/discount';
import { FileValueObject } from '@value-objects/file.value-object';
import {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { match } from 'oxide.ts';
import { V1UpdateProductHttpRequest } from './update-product.http.request.v1';
import { V1UpdateProductHttpResponse } from './update-product.http.response.v1';

@Controller('/api/v1/products/:id/update')
export class V1UpdateProductHttpController extends HttpControllerBase<
  V1UpdateProductHttpRequest,
  UpdateProductCommand,
  V1UpdateProductHttpResponse
> {
  toCommand(
    options: HttpControllerBaseOption<V1UpdateProductHttpRequest>,
  ): UpdateProductCommand {
    const { image, request, param } = options;

    const { id } = param;
    const { name, description, price, discountId } = request;

    const command = new UpdateProductCommand({
      id: new ProductIdValueObject(id),
      name: name && new ProductNameValueObject(name),
      description:
        description && new ProductDescriptionValueObject(description),
      image:
        image &&
        new FileValueObject({
          name: image?.originalname,
          value: image?.buffer,
        }),
      price: price && new ProductPriceValueObject(price),
      discountId: discountId && new DiscountIdValueObject(discountId),
    });

    return command;
  }
  validate(command: UpdateProductCommand): void {
    const exceptions = command.validate();
    if (exceptions.length > 0) {
      throw new UnprocessableEntityException(exceptions);
    }
  }
  extractResult(result: any): V1UpdateProductHttpResponse {
    return match(result, {
      Ok: (response: UpdateProductResponseDto) =>
        new V1UpdateProductHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }

        throw e;
      },
    });
  }
  @Put()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async execute(
    @UploadedFile() image: Express.Multer.File,
    @Body() request: V1UpdateProductHttpRequest,
    @Param('id') id: string,
  ): Promise<any> {
    return super._execute({
      request,
      image,
      param: {
        id,
      },
    });
  }

  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
}
