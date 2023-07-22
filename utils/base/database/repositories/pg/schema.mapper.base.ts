export abstract class SchemaMapperBase<Domain, Schema> {
  abstract toDomain(model: Schema): Domain;
  abstract toPersistance(model: Partial<Domain>): Partial<Schema>;
}
