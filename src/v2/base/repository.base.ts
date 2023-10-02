import { DatabaseService } from '@config/database';

export class RepositoryBase {
  constructor(protected readonly databaseService: DatabaseService) {}

  async runInTransaction<T = any>(fn: () => Promise<T>): Promise<T> {
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
}
