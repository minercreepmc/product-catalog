import { ValidationResponse } from 'common-base-classes';

export interface ReplaceExceptionCodeOptions {
  response: ValidationResponse;
  superClass: string;
  targetClass: string;
}

export function replaceExceptionCode(
  options: ReplaceExceptionCodeOptions,
): ValidationResponse {
  const { response, superClass, targetClass } = options;

  if (response.isValid) {
    return response;
  }

  response.exceptions = response.exceptions.map((exception) => {
    exception.code = exception.code.replace(superClass, targetClass);
    return exception;
  });

  return response;
}
