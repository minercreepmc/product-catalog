import { V1GetProfileHttpController } from '@controllers/http/v1';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

const controllers = [V1GetProfileHttpController];
const sharedModules = [CqrsModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
})
export class UserQueryModule {}
