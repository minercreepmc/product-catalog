import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class BaseService {
  formatError(status: number, code: string, message: string) {
    throw new HttpException({ message: { code, message } }, status);
  }

  formatData(status: number, body: any) {
    return { status, body };
  }
}
