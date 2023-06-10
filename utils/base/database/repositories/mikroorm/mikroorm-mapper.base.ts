import {
  AbstractAggregateRoot,
  DateVO,
  EntityConstructor,
  ID,
} from 'common-base-classes';
import { MikroOrmModelConstructor, OrmModelDetails } from './common-type';
import { MikroOrmModelBase } from './mikroorm-model.base';

export abstract class MikroOrmMapperBase<
  DomainModel extends AbstractAggregateRoot<any>,
  DomainModelDetails,
  OrmModel extends MikroOrmModelBase,
> {
  constructor(
    private readonly entityConstructor: EntityConstructor<DomainModel>,
    private readonly ormModelConstructor: MikroOrmModelConstructor<OrmModel>,
  ) {}

  protected abstract toPersistanceDetails(
    entity: DomainModel,
  ): Promise<OrmModelDetails<OrmModel>>;
  protected abstract toDomainDetails(
    ormModel: OrmModel,
  ): Promise<DomainModelDetails>;

  async toPersistance(entity: DomainModel): Promise<OrmModel> {
    const details = await this.toPersistanceDetails(entity);

    return new this.ormModelConstructor({
      ...details,
      id: entity.id.unpack(),
      createdAt: entity.createdAt.unpack(),
      updatedAt: entity.updatedAt.unpack(),
    });
  }

  async toDomain(ormModel: OrmModel): Promise<DomainModel> {
    const details = await this.toDomainDetails(ormModel);
    const id = new ID(ormModel.id);
    const createdAt = DateVO.create(ormModel.createdAt);
    const updatedAt = DateVO.create(ormModel.updatedAt);

    return new this.entityConstructor({
      id,
      details,
      createdAt,
      updatedAt,
    });
  }
}
