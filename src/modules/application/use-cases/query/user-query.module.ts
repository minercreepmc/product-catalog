import { V1GetProfileHttpController } from '@controllers/http/v1';
import { AuthModule } from '@modules/infrastructures/auth';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetProductQuery } from '@use-cases/query/product';

const queryHandlers: Provider[] = [GetProductQuery];

const controllers = [V1GetProfileHttpController];

const sharedModules = [CqrsModule, AuthModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...queryHandlers],
})
export class UserQueryModule {}
