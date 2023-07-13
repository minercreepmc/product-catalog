import { RepositoryPort } from '@domain-interfaces';
import { EntityManager } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import { AbstractAggregateRoot, ID } from 'common-base-classes';
import { MikroOrmModelConstructor, QueryParams } from './common-type';
import { MikroOrmMapperBase } from './mikroorm-mapper.base';
import { MikroOrmModelBase } from './mikroorm-model.base';
import { MikroOrmQueryMapper } from './mikroorm-query-mapper.base';

export abstract class MikroOrmRepositoryBase<
  DomainModel extends AbstractAggregateRoot<any>,
  DomainModelDetails,
  OrmModel extends MikroOrmModelBase,
> implements RepositoryPort<DomainModel, DomainModelDetails>
{
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly mapper: MikroOrmMapperBase<
      DomainModel,
      DomainModelDetails,
      OrmModel
    >,
    protected readonly queryMapper: MikroOrmQueryMapper<
      DomainModelDetails,
      OrmModel
    >,
    protected readonly mikroEntityName: MikroOrmModelConstructor<OrmModel>,
    protected readonly logger: Logger,
  ) {}

  async save(entity: DomainModel): Promise<DomainModel> {
    const ormEntity = await this.mapper.toPersistance(entity);
    const saved = await this.entityManager.upsert<OrmModel>(ormEntity);
    this.logger.debug(`[Repository]: saved ${ormEntity.id}`);
    return this.mapper.toDomain(saved);
  }

  async delete(
    params: QueryParams<DomainModelDetails> = {},
  ): Promise<DomainModel> {
    const query = this.queryMapper.toQuery(params);

    const entity = this.entityManager.getReference(this.mikroEntityName, query);
    const found = await this.entityManager.findOne<OrmModel>(
      this.mikroEntityName,
      query,
    );

    await this.entityManager.removeAndFlush(entity);
    this.logger.debug(`[Repository]: deleted`);

    return found ? this.mapper.toDomain(found) : null;
  }

  async findOneById(id: ID): Promise<DomainModel> {
    const query = this.queryMapper.toQuery({
      id,
    } as QueryParams<DomainModelDetails>);
    const found = await this.entityManager.findOne<OrmModel>(
      this.mikroEntityName,
      query,
    );
    return found ? this.mapper.toDomain(found) : null;
  }

  async findOne(params: QueryParams<DomainModelDetails>): Promise<DomainModel> {
    const query = this.queryMapper.toQuery(params);
    const found = await this.entityManager.findOne<OrmModel>(
      this.mikroEntityName,
      query,
    );
    return found ? this.mapper.toDomain(found) : null;
  }

  async update(
    params: QueryParams<DomainModelDetails>,
    newState: DomainModel,
  ): Promise<DomainModel> {
    const query = this.queryMapper.toQuery(params);

    const newStateOrm = await this.mapper.toPersistance(newState);

    const ormEntity = await this.entityManager.findOne<OrmModel>(
      this.mikroEntityName,
      query,
    );

    let updated: OrmModel;
    if (ormEntity) {
      updated = await this.entityManager.upsert<OrmModel>(
        this.mikroEntityName,
        newStateOrm,
      );
      this.logger.debug(`[Repository]: updated ${ormEntity.id}`);
    }

    return updated ? this.mapper.toDomain(updated) : null;
  }

  // async findMany(
  //   options?: FindManyOptions<DomainModelDetails>,
  // ): Promise<DomainModel[]> {
  //   const { params = {}, filter = {} } = options;
  //   let query: OrmModel;
  //   let filterOptions: FilterOptions;
  //
  //   if (params) {
  //     query = this.queryMapper.toQuery(params);
  //   }
  //
  //   if (filter) {
  //     filterOptions = this.queryMapper.toOptions(filter);
  //   }
  //
  //   const ormEntities = await this.entityManager.find<OrmModel>(
  //     this.mikroEntityName,
  //     query,
  //     filterOptions,
  //   );
  //
  //   const promises = ormEntities.map((ormEntity) =>
  //     this.mapper.toDomain(ormEntity),
  //   );
  //   return Promise.all(promises);
  // }
}
