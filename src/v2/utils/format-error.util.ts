import { HttpException, HttpStatus, Logger } from '@nestjs/common';

export function formatError(
  status: number,
  code: string,
  message: string,
  logger?: Logger,
  e?: any,
) {
  if (status === HttpStatus.INTERNAL_SERVER_ERROR && logger) {
    logger.error(e);
  }
  throw new HttpException({ message: { code, message } }, status);
}
