import { v1ApiEndpoints } from '@api/http';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

@Controller(v1ApiEndpoints.logOut)
@UseGuards(JwtAuthenticationGuard)
export class V1LogOutHttpController {
  constructor(
    @Inject(authServiceDiToken) private readonly authService: AuthServicePort,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  execute(@Res() response: Response) {
    console.log('Log out');
    response.setHeader('Set-Cookie', this.authService.getLogOutCookie());
    return response.json();
  }
}
