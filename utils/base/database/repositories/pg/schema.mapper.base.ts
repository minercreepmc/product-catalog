export abstract class SchemaMapperBase<Domain, Schema> {
  abstract toDomain(model: Schema): Domain | Promise<Domain>;
  abstract toPersistance(model: Partial<Domain>): Partial<Schema>;
}
