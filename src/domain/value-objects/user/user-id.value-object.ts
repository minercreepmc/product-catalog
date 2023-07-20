import { ID } from '@base/domain';
import { IsDefined, IsString } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class UserIdValueObject implements ID {
  @IsDefined()
  @IsString()
  readonly value: string;

  constructor(value?: string) {
    this.value = value ?? uuidv4();
  }
}
