import { HandlerExceptions } from '@shared/gateways';
import { UserProxy } from '@use-cases/application-services/proxies';
import { Builder, Saga } from 'nestjs-saga';
import { match } from 'oxide.ts';
import { CreateReviewerHandler } from '../create-reviewer.handler';
import { CreateReviewerResponseDto } from '../dtos';
import {
  CreateReviewerSagaRequestDto,
  CreateReviewerSagaResponseDto,
} from './create-reviewer.saga.dto';

@Saga(CreateReviewerSagaRequestDto)
export class CreateReviewerSaga {
  constructor(
    private readonly createReviewerHandler: CreateReviewerHandler,
    private readonly userProxy: UserProxy,
  ) {}

  response: CreateReviewerSagaResponseDto = {} as CreateReviewerSagaResponseDto;

  saga = new Builder<
    CreateReviewerSagaRequestDto,
    CreateReviewerSagaResponseDto
  >()
    .step('create reviewer')
    .invoke(this.createReviewer)
    .withCompensation(this.deleteReviewer)
    .step('register member')
    .invoke(this.registerMember)
    .withCompensation(this.onMemberCreationFailure)
    .return(this.okResponse)
    .build();

  async createReviewer(states: CreateReviewerSagaRequestDto) {
    const dto = states.makeCreateReviewerRequestDto();
    const result = await this.createReviewerHandler.handle(dto);
    match(result, {
      Ok: (response: CreateReviewerResponseDto) => {
        this.response = Object.assign(response);
      },
      Err: (exception: HandlerExceptions) => {
        throw new Error(JSON.stringify(exception.exceptions));
      },
    });
  }

  async deleteReviewer(states: CreateReviewerSagaRequestDto) {
    //
  }

  async registerMember(states: CreateReviewerSagaRequestDto) {
    let result: any;
    const dto = states.makeRegisterMemberRequestDto();
    try {
      result = await this.userProxy.registerMember(dto);
    } catch (exception) {
      if (exception instanceof HandlerExceptions) {
        throw new Error(JSON.stringify(exception.exceptions));
      }
    }
    this.response = result;
  }

  onMemberCreationFailure(states: CreateReviewerSagaRequestDto) {
    console.log('hey');
  }

  okResponse() {
    return this.response;
  }
}
