import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { RemoveCategoryResponseDto } from './remove-category.dto';
import { Result } from 'oxide.ts';

export type RemoveCategorySuccess = RemoveCategoryResponseDto;
export type RemoveCategoryFailure =
  Array<CategoryDomainExceptions.DoesNotExist>;
export type RemoveCategoryResult = Result<
  RemoveCategorySuccess,
  RemoveCategoryFailure
>;
