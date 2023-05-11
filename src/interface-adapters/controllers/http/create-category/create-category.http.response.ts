import { CreateCategoryResponseDto } from '@use-cases/create-category/dtos';

export class CreateCategoryHttpResponse implements CreateCategoryResponseDto {
  id: string;
  name: string;
  description?: string;
  parentIds?: string[];
  subCategoryIds?: string[];
  productIds?: string[];

  constructor(response: CreateCategoryHttpResponse) {
    this.id = response.id;
    this.name = response.name;
    this.description = response.description;
    this.parentIds = response.parentIds;
    this.subCategoryIds = response.subCategoryIds;
    this.productIds = response.productIds;
  }
}
