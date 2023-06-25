import {
  clientProxyDiToken,
  userMessageBrokerDiToken,
} from '@domain-interfaces';
import { Module, Provider } from '@nestjs/common';
import { UserMessageBroker } from '@src/infrastructures/ipc';
import { RmqModule } from './rmb';

const messageBrokers: Provider[] = [
  {
    provide: userMessageBrokerDiToken,
    useClass: UserMessageBroker,
  },
];

@Module({
  imports: [
    RmqModule.register([
      {
        name: clientProxyDiToken,
      },
    ]),
  ],
  providers: [...messageBrokers],
  exports: [RmqModule, ...messageBrokers],
})
export class IpcModule {}
