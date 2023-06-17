import { Builder, Saga } from 'nestjs-saga';
import { CreateReviewerSagaStates } from './create-reviewer.saga-states';

@Saga(CreateReviewerSagaStates)
export class CreateReviewerSaga {
  constructor(private readonly states: CreateReviewerSagaStates) {}

  saga = new Builder()
    .step('create user')
    .invoke(this.createUser)
    .withCompensation(this.rollbackCreateUser)
    .build();

  createUser(states: CreateReviewerSagaStates) {
    console.log('create user');
  }

  rollbackCreateUser() {
    console.log('rollback create user');
  }
}
