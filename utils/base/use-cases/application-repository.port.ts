export interface ApplicationRepositoryPort<Schema> {
  create(entity: Schema): Promise<Schema>;
  deleteOneById(id: string): Promise<Schema>;
  findOneById(id: string): Promise<Schema>;
  updateOneById(id: string, newState: Schema): Promise<Schema>;
}
