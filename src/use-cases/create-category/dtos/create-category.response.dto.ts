export class CreateCategoryResponseDto {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly parentIds?: string[];
  readonly subCategoryIds?: string[];
  readonly productIds?: string[];

  constructor(options: CreateCategoryResponseDto) {
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.parentIds = options.parentIds;
    this.subCategoryIds = options.subCategoryIds;
    this.productIds = options.productIds;
  }
}
