import {
  productMessageBrokerDiToken,
  ProductMessageBrokerPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HandlerExceptions } from './dtos';
import {
  V1CreateReviewerRequestDto,
  V1CreateReviewerResponseDto,
  V1ProductInterface,
} from './handlers';
import {
  V1ProductPattern,
  V1RemoveReviewerRequestDto,
} from './handlers/product.interface';

@Injectable()
export class ProductProxy implements V1ProductInterface {
  constructor(
    @Inject(productMessageBrokerDiToken)
    private readonly productMessageBroker: ProductMessageBrokerPort,
  ) {}
  async createReviewer(
    request: V1CreateReviewerRequestDto,
  ): Promise<V1CreateReviewerResponseDto> {
    try {
      const response = await lastValueFrom(
        this.productMessageBroker.send(
          V1ProductPattern.CREATE_REVIEWER.toString(),
          request,
        ),
      );
      return response;
    } catch (exceptions) {
      throw new HandlerExceptions(exceptions);
    }
  }

  removeReviewer(
    request: V1RemoveReviewerRequestDto,
  ): Promise<V1CreateReviewerResponseDto> {
    try {
      return lastValueFrom(
        this.productMessageBroker.send(
          V1ProductPattern.REMOVE_REVIEWER.toString(),
          request,
        ),
      );
    } catch (exceptions) {
      throw new HandlerExceptions(exceptions);
    }
  }
}
