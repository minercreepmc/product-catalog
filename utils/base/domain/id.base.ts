import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { ValueObjectBase } from './value-object.base';
import { v4 as uuid } from 'uuid';

export abstract class ID implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  value: string;

  constructor(value?: string) {
    this.value = value ?? uuid();
  }
}
