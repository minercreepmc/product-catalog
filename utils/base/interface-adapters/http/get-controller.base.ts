import { QueryBase } from '@base/use-cases/query-handler';
import { UnprocessableEntityException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

export abstract class HttpGetControllerBase<THttpRequest> {
  constructor(protected readonly queryBus: QueryBus) {}

  async execute(httpRequest: THttpRequest, param?: string): Promise<any> {
    const query = this.createQuery(httpRequest, param);

    try {
      const result = await this.queryBus.execute(query);
      return result;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  abstract createQuery(
    httpRequest: THttpRequest,
    param?: string,
  ): QueryBase<any>;
}
