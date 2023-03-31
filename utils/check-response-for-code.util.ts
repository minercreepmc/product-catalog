import { Response } from 'supertest';

export interface CheckResponseForCodeOptions {
  response: Response;
  statusCode: number;
  codes: string[];
}

export function checkResponseForCode(
  options: CheckResponseForCodeOptions,
): boolean {
  const { codes, response, statusCode } = options;
  const responseBody = response.body;

  if (responseBody.statusCode !== statusCode) {
    return false;
  }

  // Check if every code in the 'codes' array is present in the responseBody message
  return codes.every((targetCode) =>
    responseBody.message.some(
      (msg: { message: string; code: string }) => msg.code === targetCode,
    ),
  );
}
