import { Message } from '@shared/gateways/message.interface';
import { MessageTypes } from '@shared/microservices/message-types';
import { Services } from '@shared/microservices/services';

export class UserMessagerBrokerMapper {
  constructor(private readonly destination: string) {}

  mapToMessage(request: any) {
    const message = {
      header: {
        source: Services.PRODUCT_CATALOG.toString(),
        destination: this.destination,
        timestamp: new Date(Date.now()),
        messageType: MessageTypes.PROTOBUF.toString(),
      },
      content: request,
    };

    return Message.encode(message).finish();
  }
}
