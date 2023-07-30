import { v1ApiEndpoints } from '@api/http';
import {
  authServiceDiToken,
  AuthServicePort,
} from '@domain-interfaces/services';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

@Controller(v1ApiEndpoints.logOut)
export class V1LogOutHttpController {
  constructor(
    @Inject(authServiceDiToken) private readonly authService: AuthServicePort,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  execute(@Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getLogOutCookie());
    return response.json();
  }
}
