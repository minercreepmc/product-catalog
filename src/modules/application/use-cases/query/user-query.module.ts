import {
  V1GetProfileHttpController,
  V1GetUsersHttpController,
} from '@controllers/http/v1';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUsersHandler } from '@use-cases/query/user';

const controllers = [V1GetProfileHttpController, V1GetUsersHttpController];
const sharedModules = [CqrsModule];

@Module({
  imports: [...sharedModules],
  providers: [GetUsersHandler],
  controllers: [...controllers],
})
export class UserQueryModule {}
