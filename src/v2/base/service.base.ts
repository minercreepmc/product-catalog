import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class BaseService {
  formatError(status: number, code: string, message: string, field?: string) {
    throw new HttpException(
      {
        message: [
          {
            error: message,
            code,
            field,
          },
        ],
      },
      status,
    );
  }

  formatData(status: number, body: any) {
    return { status, body };
  }
}
