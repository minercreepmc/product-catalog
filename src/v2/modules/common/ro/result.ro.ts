import { Expose } from 'class-transformer';

export class ResultRO {
  @Expose()
  result: boolean;
}
