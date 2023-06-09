import { V1CreateReviewerSagaHttpController } from '@controllers/http/v1';
import { IpcModule } from '@modules/infrastructures/ipc';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductProxy, UserProxy } from '@shared/proxies';
import { CreateReviewerSaga } from '@use-cases/command/create-reviewer/sagas';
import { SagaModule } from 'nestjs-saga';
import { CreateReviewerModule } from './create-reviewer.module';
import { RemoveReviewerModule } from './remove-reviewer.module';

const proxies: Provider[] = [UserProxy, ProductProxy];
const controllers = [V1CreateReviewerSagaHttpController];
@Module({
  imports: [
    SagaModule.register({
      imports: [IpcModule, CreateReviewerModule, RemoveReviewerModule],
      sagas: [CreateReviewerSaga],
      providers: [...proxies],
    }),
    CqrsModule,
  ],
  controllers: [...controllers],
  providers: [],
})
export class CreateReviewerSagaModule {}
