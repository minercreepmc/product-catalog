import { Module, Provider } from '@nestjs/common';
import { UserProxy } from '@use-cases/application-services/proxies';
import { CreateReviewerSaga } from '@use-cases/create-reviewer/sagas';
import { SagaModule } from 'nestjs-saga';
import { IpcModule } from '../infrastructures/ipc';
import { CreateReviewerModule } from './create-reviewer.module';

const proxies: Provider[] = [UserProxy];
@Module({
  imports: [
    SagaModule.register({
      imports: [IpcModule, CreateReviewerModule],
      sagas: [CreateReviewerSaga],
      providers: [...proxies],
    }),
  ],
})
export class CreateReviewerSagaModule {}
