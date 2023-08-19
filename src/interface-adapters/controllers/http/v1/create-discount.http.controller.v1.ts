import {
  v1ApiEndpoints,
  V1CreateDiscountHttpRequest,
  V1CreateDiscountHttpResponse,
} from '@api/http';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { Roles } from '@application/application-services/auth/roles';
import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateDiscountCommand,
  CreateDiscountResponseDto,
} from '@use-cases/command/create-discount';
import {
  DiscountDescriptionValueObject,
  DiscountNameValueObject,
  DiscountPercentageValueObject,
} from '@value-objects/discount';
import { UserRoleEnum } from '@value-objects/user';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.createDiscount)
export class V1CreateDiscountHttpController extends HttpControllerBase<
  V1CreateDiscountHttpRequest,
  CreateDiscountCommand,
  V1CreateDiscountHttpResponse
> {
  constructor(commandBus: CommandBus) {
    super(commandBus);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @Roles(UserRoleEnum.Admin)
  execute(@Body() request: V1CreateDiscountHttpRequest) {
    return super._execute({
      request,
    });
  }

  toCommand(
    options: HttpControllerBaseOption<V1CreateDiscountHttpRequest>,
  ): CreateDiscountCommand {
    const { name, description, percentage } = options.request!;
    return new CreateDiscountCommand({
      name: new DiscountNameValueObject(name),
      description: description
        ? new DiscountDescriptionValueObject(description)
        : undefined,
      percentage: new DiscountPercentageValueObject(Number(percentage)),
    });
  }
  extractResult(result: any): V1CreateDiscountHttpResponse {
    return match(result, {
      Ok: (response: CreateDiscountResponseDto) =>
        new V1CreateDiscountHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }

        throw e;
      },
    });
  }
}
