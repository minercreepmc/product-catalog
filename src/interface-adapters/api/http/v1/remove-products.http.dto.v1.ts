export class V1RemoveProductsHttpRequest {
  ids: string[];
}

export class V1RemoveProductsHttpResponse {
  ids: string[];
  message: string;

  constructor(options: Omit<V1RemoveProductsHttpResponse, 'message'>) {
    this.ids = options.ids;
    this.message = 'Products removed successfully';
  }
}
