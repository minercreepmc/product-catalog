export class V1RemoveCategoriesHttpResponse {
  ids: string[];
  parentIds: string[];
  subIds: string[];
  message: string;

  constructor(options: Omit<V1RemoveCategoriesHttpResponse, 'message'>) {
    this.ids = options.ids;
    this.parentIds = options.parentIds;
    this.subIds = options.subIds;
    this.message = 'Categories removed successfully.';
  }
}
