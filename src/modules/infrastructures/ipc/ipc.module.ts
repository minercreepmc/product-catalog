import { Module } from '@nestjs/common';
import { RmqModule } from './rmb';

@Module({
  imports: [RmqModule],
})
export class IpcModule {}
