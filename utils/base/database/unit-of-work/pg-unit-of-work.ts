import { DatabaseService } from '@config/database';
import { UnitOfWorkPort } from '@domain-interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UnitOfWork implements UnitOfWorkPort {
  async runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
    const poolClient = await this.databaseService.getPoolClient();

    try {
      await poolClient.query('BEGIN');
      const result = await fn();
      await poolClient.query('COMMIT');

      return result;
    } catch (error) {
      await poolClient.query('ROLLBACK');
      throw error;
    } finally {
      poolClient.release();
    }
  }

  constructor(private readonly databaseService: DatabaseService) {}
}
