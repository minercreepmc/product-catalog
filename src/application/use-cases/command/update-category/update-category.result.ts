import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { Result } from 'oxide.ts';
import { UpdateCategoryResponseDto } from './update-category.dto';

export type UpdateCategorySuccess = UpdateCategoryResponseDto;
export type UpdateCategoryFailure = Array<
  CategoryDomainExceptions.DoesNotExist | ProductDomainExceptions.DoesNotExist
>;
export type UpdateCategoryResult = Result<
  UpdateCategorySuccess,
  UpdateCategoryFailure
>;
