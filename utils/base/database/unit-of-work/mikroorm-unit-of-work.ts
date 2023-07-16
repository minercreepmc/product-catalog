import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MikroOrmUnitOfWork {
  constructor(private readonly entityManager: EntityManager) {}

  runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
    return this.entityManager.transactional<T>(async () => {
      return fn();
    });
  }
}
