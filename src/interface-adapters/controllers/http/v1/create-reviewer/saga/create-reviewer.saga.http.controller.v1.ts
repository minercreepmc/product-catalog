import { Body, Controller, Post, ConflictException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateReviewerRequestDto } from '@use-cases/command/create-reviewer/dtos';
import {
  CreateReviewerSagaRequestDto,
  CreateReviewerSagaResponseDto,
} from '@use-cases/command/create-reviewer/sagas';
import { SagaInvocationError, SagaCompensationError } from 'nestjs-saga';
import { V1CreateReviewerSagaHttpRequest } from './create-reviewer.saga.http.request.v1';
import { V1CreateReviewerSagaHttpResponse } from './create-reviewer.saga.http.response.v1';

@Controller('/api/v1/sagas/reviewers')
export class V1CreateReviewerSagaHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async execute(
    @Body() httpRequest: V1CreateReviewerSagaHttpRequest,
  ): Promise<any> {
    const dto = this.createDto(httpRequest);
    try {
      const result = await this.commandBus.execute(dto);
      return this.createHttpResponse(result);
    } catch (e) {
      if (e instanceof SagaInvocationError) {
        throw new ConflictException(JSON.parse(e.originalError.message));
      } else if (e instanceof SagaCompensationError) {
        console.log('SagaCompensationError');
        console.log(e.originalError);
        console.log(e.step);
        throw e.originalError;
      }
    }
  }

  createDto(
    httpRequest: V1CreateReviewerSagaHttpRequest,
  ): CreateReviewerRequestDto {
    return new CreateReviewerSagaRequestDto(httpRequest);
    //return new CreateReviewerRequestDto(httpRequest);
  }

  createHttpResponse(
    response: CreateReviewerSagaResponseDto,
  ): V1CreateReviewerSagaHttpResponse {
    return new V1CreateReviewerSagaHttpResponse(response);
  }
}
