import { IsOptional } from 'class-validator';

export class PaginationParams {
  @IsOptional()
  offset?: number = 0;
  @IsOptional()
  limit?: number = 100;
}
