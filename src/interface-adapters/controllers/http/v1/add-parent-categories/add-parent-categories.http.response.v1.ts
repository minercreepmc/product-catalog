export class V1AddParentCategoriesHttpResponse {
  parentIds: string[];
  categoryId: string;
  message?: string;
  constructor(options: Omit<V1AddParentCategoriesHttpResponse, 'message'>) {
    this.parentIds = options.parentIds;
    this.categoryId = options.categoryId;
    this.message = 'Parents added successfully';
  }
}
