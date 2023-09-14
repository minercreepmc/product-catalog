import {
  RequestWithUser,
  v1ApiEndpoints,
  V1GetCartHttpResponse,
} from '@api/http';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCartQuery, GetCartResponseDto } from '@use-cases/query/cart';
import { plainToInstance } from 'class-transformer';

@Controller(v1ApiEndpoints.getCart)
@UseGuards(JwtAuthenticationGuard)
export class V1GetCartHttpController {
  @Get()
  async execute(@Req() req: RequestWithUser): Promise<V1GetCartHttpResponse> {
    const { id } = req.user;
    const query: GetCartQuery = {
      userId: id,
    };
    const response = await this.queryBus.execute(
      plainToInstance(GetCartQuery, query),
    );
    const responseDto = response as GetCartResponseDto;
    return {
      id: responseDto.id,
      user_id: responseDto.user_id,
      total_price: responseDto.total_price,
      items: responseDto.items.map((item) => ({
        product_id: item.product?.id,
        total_price: item.total_price,
        name: item.product?.name,
        price: item.product?.price,
        amount: item.amount,
        discount: item.discount,
        image_url: item.product?.image_url,
      })),
    } as V1GetCartHttpResponse;
  }

  constructor(private readonly queryBus: QueryBus) {}
}
