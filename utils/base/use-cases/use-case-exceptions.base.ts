import { MultipleExceptions } from 'common-base-classes';

export class HandlerException extends MultipleExceptions {}

export class UseCaseCommandValidationExceptions extends HandlerException {}

export class UseCaseProcessExceptions extends HandlerException {}
