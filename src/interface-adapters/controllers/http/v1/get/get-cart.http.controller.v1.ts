import {
  RequestWithUser,
  v1ApiEndpoints,
  V1GetCartHttpResponse,
} from '@api/http';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCartQuery } from '@use-cases/query/cart';
import { plainToInstance } from 'class-transformer';

@Controller(v1ApiEndpoints.getCart)
@UseGuards(JwtAuthenticationGuard)
export class V1GetCartHttpController {
  @Get()
  execute(@Req() req: RequestWithUser): Promise<V1GetCartHttpResponse> {
    const { id } = req.user;
    const query: GetCartQuery = {
      userId: id,
    };
    return this.queryBus.execute(plainToInstance(GetCartQuery, query));
  }

  constructor(private readonly queryBus: QueryBus) {}
}