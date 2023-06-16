export class V1AddParentCategoriesHttpResponse {
  parentIds: string[];
  categoryId: string;
  constructor(options: V1AddParentCategoriesHttpResponse) {
    this.parentIds = options.parentIds;
    this.categoryId = options.categoryId;
  }
}
