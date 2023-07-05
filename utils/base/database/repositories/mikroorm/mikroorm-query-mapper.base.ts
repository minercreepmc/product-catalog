import {
  FilterOptions,
  FilterParams,
  MikroOrmModelDetails,
  QueryParams,
} from './common-type';
import { MikroOrmModelBase } from './mikroorm-model.base';

export abstract class MikroOrmQueryMapper<
  EntityDetails,
  OrmModel extends MikroOrmModelBase,
> {
  protected abstract toQueryDetails(
    details: QueryParams<EntityDetails>,
  ): Partial<MikroOrmModelDetails>;
  toQuery(params: QueryParams<EntityDetails>): OrmModel {
    const query: OrmModel = {} as OrmModel;
    const { id, createdAt, updatedAt } = params;

    if (id) {
      query.id = id.unpack();
    }

    if (createdAt) {
      query.createdAt = createdAt.unpack();
    }

    if (updatedAt) {
      query.updatedAt = updatedAt.unpack();
    }

    return {
      ...query,
      ...this.toQueryDetails(params),
    };
  }

  toOptions(filterParams: FilterParams): FilterOptions {
    const options: FilterOptions = {};
    if (!filterParams) {
      return {};
    }

    if (filterParams.limit) {
      options.limit = filterParams.limit;
    }

    if (filterParams.offset) {
      options.offset = filterParams.offset;
    }

    return options;
  }
}
