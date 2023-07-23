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
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  UpdateDiscountCommand,
  UpdateDiscountResponseDto,
} from '@use-cases/command/update-discount';
import {
  DiscountActiveValueObject,
  DiscountDescriptionValueObject,
  DiscountIdValueObject,
  DiscountNameValueObject,
  DiscountPercentageValueObject,
} from '@value-objects/discount';
import { match } from 'oxide.ts';
import { V1UpdateDiscountHttpRequest } from './update-discount.http.request.v1';
import { V1UpdateDiscountHttpResponse } from './update-discount.http.response.v1';

@Controller('/api/v1/discount')
export class V1UpdateDiscountHttpController extends HttpControllerBase<
  V1UpdateDiscountHttpRequest,
  UpdateDiscountCommand,
  V1UpdateDiscountHttpResponse
> {
  @Put(':id')
  execute(
    @Body() request: V1UpdateDiscountHttpRequest,
    @Param('id') id: string,
  ) {
    return super._execute({
      param: id,
      request,
    });
  }

  toCommand(
    options: HttpControllerBaseOption<V1UpdateDiscountHttpRequest>,
  ): UpdateDiscountCommand {
    const { name, description, percentage, active } = options.request;
    return new UpdateDiscountCommand({
      id: new DiscountIdValueObject(options.param),
      name: name && new DiscountNameValueObject(name),
      description:
        description && new DiscountDescriptionValueObject(description),
      percentage: percentage && new DiscountPercentageValueObject(percentage),
      active: active && new DiscountActiveValueObject(active),
    });
  }
  validate(command: UpdateDiscountCommand): void {
    const exceptions = command.validate();

    if (exceptions.length > 0) {
      throw new UnprocessableEntityException(exceptions);
    }
  }
  extractResult(result: any): V1UpdateDiscountHttpResponse {
    return match(result, {
      Ok: (res: UpdateDiscountResponseDto) =>
        new V1UpdateDiscountHttpResponse(res),
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
