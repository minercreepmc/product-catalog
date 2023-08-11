import { UserRepositoryPort } from '@application/interface/user';
import { ApplicationRepositoryBase } from '@base/database/repositories/pg';
import { DatabaseService } from '@config/pg';
import { Injectable } from '@nestjs/common';
import { UserSchema } from './user.schema';

@Injectable()
export class UserRepository
  extends ApplicationRepositoryBase<UserSchema>
  implements UserRepositoryPort
{
  async create(entity: UserSchema): Promise<UserSchema> {
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO "users" (
        id,
        username,
        hashed,
        role
      ) VALUES (
        $1, $2, $3, $4
      ) RETURNING *
    `,
      [entity.id, entity.username, entity.hashed, entity.role],
    );

    const saved = res.rows[0];

    return saved;
  }

  async deleteOneById(id: string): Promise<UserSchema> {
    const res = await this.databaseService.runQuery(
      `
      UPDATE "users" SET deleted_at=now() WHERE id=$1 AND deleted_at IS NULL RETURNING *
    `,
      [id],
    );

    const deleted = res.rows[0];

    return deleted;
  }
  async findOneById(id: string): Promise<UserSchema> {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users" WHERE id=$1 AND deleted_at IS NULL
      `,
      [id],
    );

    const model = res.rows[0];

    return model;
  }
  async updateOneById(id: string, newState: UserSchema): Promise<UserSchema> {
    const res = await this.databaseService.runQuery(
      `
      UPDATE "users" SET username=$2, password=$3, role=$4 WHERE id=$1 AND deleted_at IS NULL 
      `,
      [id, newState.username, newState.hashed, newState.role],
    );

    const updated = res.rows[0];

    return updated;
  }

  async findOneByName(name: string): Promise<UserSchema> {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users" WHERE username=$1 AND deleted_at IS NULL
      `,
      [name],
    );

    const model = res.rows[0];

    return model;
  }

  constructor(databaseService: DatabaseService) {
    super({
      databaseService,
    });
  }
}
