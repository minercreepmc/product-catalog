import { v1ApiEndpoints, V1GetOrderHttpResponse } from '@api/http';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetOrderQuery } from '@use-cases/query/order';
import { plainToInstance } from 'class-transformer';

@Controller(v1ApiEndpoints.getOrder)
  @UseGuards(JwtAuthenticationGuard)
export class V1GetOrderHttpController {
  @Get()
  execute(@Param('id') id: string): Promise<V1GetOrderHttpResponse> {
    const query: GetOrderQuery = { id };
    return this.queryBus.execute(plainToInstance(GetOrderQuery, query));
  }
  constructor(private readonly queryBus: QueryBus) {}
}
