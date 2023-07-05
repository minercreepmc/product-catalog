export class QueryBase<Fields> {
  fields: (keyof Fields)[];
  offset?: number;
  limit?: number;

  constructor(options?: any) {
    this.fields = options?.fields;
    this.offset = options?.offset;
    this.limit = options?.limit;
  }
}
