import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rmq.service';

interface RmqModuleOption {
  name: string | symbol;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name }: RmqModuleOption): DynamicModule {
    return {
      module: RmqModule,
      exports: [ClientsModule],
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const user = configService.get('RABBITMQ_USER');
              const password = configService.get('RABBITMQ_PASSWORD');
              const host = configService.get('RABBITMQ_HOST');
              const queueName = configService.get('RABBITMQ_QUEUE_NAME');

              return {
                transport: Transport.RMQ,
                options: {
                  urls: [`amqp://${user}:${password}@${host}`],
                  queue: queueName,
                },
              };
            },
          },
        ]),
      ],
    };
  }
}
