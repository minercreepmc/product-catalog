import {
  DeleteOneById,
  FindOneById,
  Create,
  UpdateOneById,
} from './plugins.interface';

export interface RepositoryPort<DomainEntity>
  extends Create<DomainEntity>,
    DeleteOneById<DomainEntity>,
    FindOneById<DomainEntity>,
    UpdateOneById<DomainEntity> {}
