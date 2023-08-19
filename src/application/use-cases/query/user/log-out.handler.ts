import {
  authServiceDiToken,
  AuthServicePort,
} from '@domain-interfaces/services';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class LogOutQuery {}

@QueryHandler(LogOutQuery)
export class LogOutHanler implements IQueryHandler<LogOutQuery> {
  constructor(
    @Inject(authServiceDiToken) private readonly authService: AuthServicePort,
  ) {}
  execute(): Promise<string> {
    return Promise.resolve(this.authService.getLogOutCookie());
  }
}
