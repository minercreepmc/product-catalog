import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rmq.service';

interface RmqModuleOption {
  name: string;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register(options: RmqModuleOption[]): DynamicModule {
    return {
      module: RmqModule,
      exports: [ClientsModule],
      imports: [
        ClientsModule.registerAsync(
          options.map((option) => ({
            name: option.name,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const user = configService.get('RABBITMQ_USER');
              const password = configService.get('RABBITMQ_PASSWORD');
              const host = configService.get('RABBITMQ_HOST');

              return {
                transport: Transport.RMQ,
                options: {
                  urls: [`amqp://${user}:${password}@${host}`],
                  queue: option.name,
                },
              };
            },
          })),
        ),
      ],
    };
  }
}
