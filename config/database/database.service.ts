import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'pg';
import { CONNECTION_POOL } from './database.module-definition';

@Injectable()
export class DatabaseService {
  constructor(@Inject(CONNECTION_POOL) private readonly pool: Pool) {}

  async runQuery(query: string, params?: unknown[]) {
    return this.pool.query(query, params);
  }

  async getPoolClient() {
    return this.pool.connect();
  }
}
