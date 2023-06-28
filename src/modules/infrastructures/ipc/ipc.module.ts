import {
  userClientProxy,
  productClientProxy,
  userMessageBrokerDiToken,
  productMessageBrokerDiToken,
} from '@domain-interfaces';
import { Module, Provider } from '@nestjs/common';
import { ProductMessageBroker } from '@shared/ipc/product';
import { UserMessageBroker } from '@shared/ipc/user';
import { RmqModule } from './rmb';

const messageBrokers: Provider[] = [
  {
    provide: userMessageBrokerDiToken,
    useClass: UserMessageBroker,
  },
  {
    provide: productMessageBrokerDiToken,
    useClass: ProductMessageBroker,
  },
];

@Module({
  imports: [
    RmqModule.register([
      {
        name: userClientProxy,
      },
      {
        name: productClientProxy,
      },
    ]),
  ],
  providers: [...messageBrokers],
  exports: [RmqModule, ...messageBrokers],
})
export class IpcModule {}
