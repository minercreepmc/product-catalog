import { Logger } from '@nestjs/common';

export const handleError = (e: any, logger: Logger) => {
  logger.error(e);
  throw new Error('Internal Server Error');
};
