export class V1RemoveCategoriesHttpResponse {
  ids: string[];
  message: string;

  constructor(options: Omit<V1RemoveCategoriesHttpResponse, 'message'>) {
    this.ids = options.ids;
    this.message = 'Categories removed successfully.';
  }
}
