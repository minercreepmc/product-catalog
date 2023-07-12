import { RequestDtoBase, ResponseDtoBase } from '@base/use-cases';

export class CreateCategoryRequestDto extends RequestDtoBase<CreateCategoryResponseDto> {
  name: string;
  description?: string;
  parentIds?: string[];
  subCategoryIds?: string[];
  productIds?: string[];

  constructor(options: Omit<CreateCategoryRequestDto, 'returnType'>) {
    super();
    this.name = options.name;
    this.description = options.description;
    this.parentIds = options.parentIds;
    this.subCategoryIds = options.subCategoryIds;
    this.productIds = options.productIds;
  }
}

export class CreateCategoryResponseDto extends ResponseDtoBase {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly parentIds?: string[];
  readonly subCategoryIds?: string[];
  readonly productIds?: string[];

  constructor(options: Omit<CreateCategoryResponseDto, 'message'>) {
    super('Category created successfully');
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.parentIds = options.parentIds;
    this.subCategoryIds = options.subCategoryIds;
    this.productIds = options.productIds;
  }
}
