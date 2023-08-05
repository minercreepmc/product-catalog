import {
  DeleteOneById,
  FindOneById,
  Create,
  UpdateOneById,
  DeleteManyByIds,
} from './plugins.interface';

export interface RepositoryPort<DomainEntity>
  extends Create<DomainEntity>,
    DeleteOneById<DomainEntity>,
    FindOneById<DomainEntity>,
    UpdateOneById<DomainEntity>,
    DeleteManyByIds<DomainEntity> {}
