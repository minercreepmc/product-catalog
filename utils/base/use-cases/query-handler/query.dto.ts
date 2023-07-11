export class QueryBase<Fields> {
  where?: Fields;
  fields: (keyof Fields)[];
  offset?: number;
  limit?: number;

  constructor(options?: any) {
    this.where = options?.where;
    this.fields = options?.fields;
    this.offset = options?.offset;
    this.limit = options?.limit;
  }
}
