export abstract class SchemaMapperBase<Domain, Schema> {
  abstract toDomain(model: Schema): Domain;
  abstract toPersistance(model: Domain): Partial<Schema>;
  abstract toQuery(model: Partial<Domain>): Partial<Schema>;
}
