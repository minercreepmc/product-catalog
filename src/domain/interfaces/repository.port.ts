import {
  Delete,
  FindOne,
  FindOneById,
  Save,
  Update,
} from './plugins.interface';

export interface RepositoryPort<DomainEntity, DomainEntityDetails>
  extends Save<DomainEntity>,
    Delete<DomainEntityDetails>,
    FindOneById<DomainEntity>,
    FindOne<DomainEntity, DomainEntityDetails>,
    Update<DomainEntity, DomainEntityDetails> {}
