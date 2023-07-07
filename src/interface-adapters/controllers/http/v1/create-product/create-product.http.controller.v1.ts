import { HttpFilePostController } from '@base/interface-adapters/http/post-file-controller.base';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import {
  CreateProductRequestDto,
  CreateProductResponseDto,
} from '@use-cases/command/create-product/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1CreateProductHttpRequest } from './create-product.http.request.v1';
import { V1CreateProductHttpResponse } from './create-product.http.response.v1';

@Controller('/api/v1/products/create')
export class V1CreateProductHttpController extends HttpFilePostController<
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse
> {
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async execute(
    @UploadedFile() image: Express.Multer.File,
    @Body() httpRequest: V1CreateProductHttpRequest,
  ): Promise<any> {
    console.log(image, httpRequest);
    return super.execute(image, httpRequest);
  }

  createDto(
    httpRequest: V1CreateProductHttpRequest,
    image: Express.Multer.File,
  ): CreateProductRequestDto {
    return new CreateProductRequestDto({
      ...httpRequest,
      image,
    });
  }

  createHttpResponse(
    response: CreateProductResponseDto,
  ): V1CreateProductHttpResponse {
    return new V1CreateProductHttpResponse(response);
  }
  constructor(mediator: Mediator) {
    super(mediator);
  }
}
