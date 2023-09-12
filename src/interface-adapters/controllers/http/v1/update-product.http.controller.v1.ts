import {
  v1ApiEndpoints,
  V1UpdateProductHttpRequest,
  V1UpdateProductHttpResponse,
} from '@api/http';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { Roles } from '@application/application-services/auth/roles';
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import {
  UpdateProductCommand,
  UpdateProductResponseDto,
} from '@use-cases/command/update-product';
import { FileValueObject } from '@value-objects/file.value-object';
import {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
  ProductSoldValueObject,
} from '@value-objects/product';
import { UserRoleEnum } from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.updateProduct)
export class V1UpdateProductHttpController extends HttpControllerBase<
  V1UpdateProductHttpRequest,
  UpdateProductCommand,
  V1UpdateProductHttpResponse
> {
  @Put()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthenticationGuard)
  @Roles(UserRoleEnum.Admin)
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

  toCommand(
    options: HttpControllerBaseOption<V1UpdateProductHttpRequest>,
  ): UpdateProductCommand {
    const { image, request, param } = options;

    const { id } = param;
    const { name, description, price, discountId, categoryIds, sold } =
      request!;

    const command = new UpdateProductCommand({
      id: new ProductIdValueObject(id),
      name: name ? new ProductNameValueObject(name) : undefined,
      description: description
        ? new ProductDescriptionValueObject(description)
        : undefined,
      image:
        image &&
        new FileValueObject({
          name: image?.originalname,
          value: image?.buffer,
        }),
      price: price ? new ProductPriceValueObject(Number(price)) : undefined,
      sold: sold ? new ProductSoldValueObject(sold) : undefined,
    });

    return command;
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
  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
}
