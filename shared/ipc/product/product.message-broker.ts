import {
  productClientProxy,
  ProductMessageBrokerPort,
} from '@domain-interfaces';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Services } from '@shared/microservices/services';
import { Observable } from 'rxjs';
import { ProductMessagerBrokerMapper } from './product.message-broker.mapper';

export class ProductMessageBroker implements ProductMessageBrokerPort {
  constructor(
    @Inject(productClientProxy)
    private readonly clientProxy: ClientProxy,
  ) {}

  send(pattern: string, request: any): Observable<any> {
    const mapper = new ProductMessagerBrokerMapper(
      Services.PRODUCT_CATALOG.toString(),
    );
    const message = mapper.mapToMessage(request);
    return this.clientProxy.send(pattern, message);
  }
}
