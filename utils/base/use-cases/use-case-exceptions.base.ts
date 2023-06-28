import { MultipleExceptions } from 'common-base-classes';

export class HandlerException extends MultipleExceptions {}

export class UseCaseRequestValidationExceptions extends HandlerException {}

export class UseCaseProcessExceptions extends HandlerException {}
