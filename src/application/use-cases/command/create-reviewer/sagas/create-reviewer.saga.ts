import { ProductProxy, UserProxy } from '@shared/proxies';
import { HandlerExceptions } from '@shared/proxies/dtos/handler.exceptions';
import { RemoveReviewerRequestDto } from '@use-cases/command/remove-reviewer/dtos';
import { Builder, Saga } from 'nestjs-saga';
import {
  CreateReviewerSagaRequestDto,
  CreateReviewerSagaResponseDto,
} from './create-reviewer.saga.dto';

@Saga(CreateReviewerSagaRequestDto)
export class CreateReviewerSaga {
  constructor(
    private readonly productProxy: ProductProxy,
    private readonly userProxy: UserProxy,
  ) {}

  response: CreateReviewerSagaResponseDto = {} as CreateReviewerSagaResponseDto;

  saga = new Builder<
    CreateReviewerSagaRequestDto,
    CreateReviewerSagaResponseDto
  >()
    .step('create reviewer')
    .invoke(this.createReviewer)
    .withCompensation(this.removeReviewer)
    .step('register member')
    .invoke(this.registerMember)
    .withCompensation(this.onMemberCreationFailure)
    .return(this.okResponse)
    .build();

  async createReviewer(states: CreateReviewerSagaRequestDto) {
    const dto = states.makeCreateReviewerRequestDto();
    let response: any;
    try {
      response = await this.productProxy.createReviewer(dto);
    } catch (exceptions) {
      if (exceptions instanceof HandlerExceptions) {
        throw new Error(JSON.stringify(exceptions.exceptions));
      }
    }

    Object.assign(this.response, response);
  }

  async removeReviewer() {
    const dto = new RemoveReviewerRequestDto({
      id: this.response.id,
    });

    let result: any;

    try {
      result = await this.productProxy.removeReviewer(dto);
    } catch (exceptions) {
      if (exceptions instanceof HandlerExceptions) {
        throw new Error(JSON.stringify(exceptions.exceptions));
      }
    }

    this.response = result;
  }

  async registerMember(states: CreateReviewerSagaRequestDto) {
    let response: any;
    const dto = states.makeRegisterMemberRequestDto();
    try {
      response = await this.userProxy.registerMember(dto);
    } catch (exception) {
      if (exception instanceof HandlerExceptions) {
        throw new Error(JSON.stringify(exception.exceptions));
      }
    }
    Object.assign(this.response, response);
  }

  onMemberCreationFailure(states: CreateReviewerSagaRequestDto) {
    console.log('hey');
  }

  okResponse() {
    return this.response;
  }
}
