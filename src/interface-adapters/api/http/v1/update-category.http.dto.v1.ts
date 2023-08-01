export class V1UpdateCategoryHttpRequest {
  name?: string;
  description?: string;
  productIds?: string[];
}

export class V1UpdateCategoryHttpResponse {
  id: string;
  name?: string;
  description?: string;
  productIds?: string[];
  message?: string;
  constructor(dto: Omit<V1UpdateCategoryHttpResponse, 'message'>) {
    this.id = dto.id;
    this.name = dto.name;
    this.description = dto.description;
    this.productIds = dto.productIds;
  }
}
