import { QueryBase } from '@base/use-cases/query-handler';
import { Body, Post, UnprocessableEntityException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

export abstract class HttpGetControllerBase<THttpRequest> {
  constructor(protected readonly queryBus: QueryBus) {}

  @Post()
  async execute(@Body() httpRequest: THttpRequest): Promise<any> {
    const query = this.createQuery(httpRequest);

    try {
      const result = await this.queryBus.execute(query);
      return result;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  abstract createQuery(httpRequest: THttpRequest): QueryBase<any>;
}
