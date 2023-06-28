import { MessageExceptionFilter } from '@base/exception-filters';
import { ResultInterceptor } from '@base/interceptors';
import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { Message } from '@shared/proxies/dtos';
import { V1ProductPattern } from '@shared/proxies/handlers/product.interface';
import {
  RemoveReviewerRequestDto,
  RemoveReviewerResponseDto,
} from '@use-cases/remove-reviewer/dtos';
import { Mediator } from 'nestjs-mediator';
import { match } from 'oxide.ts';

@Controller()
export class V1RemoveReviewerRmqMessageHandler {
  constructor(private readonly mediator: Mediator) {}

  @MessagePattern(V1ProductPattern.REMOVE_REVIEWER)
  @UseInterceptors(ResultInterceptor)
  @UseFilters(new MessageExceptionFilter())
  async handle(@Payload() bytes: any, @Ctx() context: RmqContext) {
    const decoded = Message.decode(bytes.data);
    const dto = new RemoveReviewerRequestDto(decoded.content);
    const result = await this.mediator.send(dto);

    return match(result, {
      Ok: (response: RemoveReviewerResponseDto) => {
        return response;
      },

      Err: (error: Error) => {
        throw new RpcException(error);
      },
    });
  }
}
