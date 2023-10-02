import { DatabaseService } from '@config/database';
import { PaginationParams } from '@constants';
import { Injectable } from '@nestjs/common';
import { randomString } from '@utils/functions';
import { UserRole } from './constants';
import { UpdateUserDto } from './dtos';
import { UserModel } from './user.model';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(user: UserModel) {
    const { username, password, fullName, role } = user;
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO "users" (
        id,
        username,
        hashed,
        role,
        full_name
      ) VALUES (
        $1, $2, $3, $4, $5
      ) RETURNING *
    `,
      [randomString(), username, password, role, fullName],
    );

    return res.rows[0];
  }

  async deleteOneById(id: string) {
    const res = await this.databaseService.runQuery(
      `
      UPDATE "users" SET deleted_at=now() WHERE id=$1 AND deleted_at IS NULL RETURNING *
    `,
      [id],
    );

    return res.rows[0];
  }

  async findOneById(id: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT u.*,
            COALESCE(json_agg(a) FILTER (WHERE a.id IS NOT NULL), '[]'::json) AS addresses
      FROM "users" u 
      LEFT JOIN address a ON u.id=a.user_id
      WHERE id=$1 AND deleted_at IS NULL
      `,
      [id],
    );

    return res.rows[0];
  }
  async updateOneById(id: string, newState: UpdateUserDto) {
    const res = await this.databaseService.runQuery(
      `
      UPDATE "users" SET full_name=coalesce($2, full_name), hashed=coalesce($3, hashed) WHERE id=$1 AND deleted_at IS NULL RETURNING *;
      `,
      [id, newState.fullName, newState.password],
    );

    return res.rows[0];
  }

  async findOneByName(name: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users" WHERE username=$1 AND deleted_at IS NULL
      `,
      [name],
    );

    return res.rows[0];
  }

  async findAll(filter?: PaginationParams) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users" WHERE deleted_at IS NULL
      OFFSET $1 LIMIT $2
      `,
      [filter?.offset, filter?.limit],
    );

    return res.rows;
  }

  async findAllByRole(role: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users" WHERE role=$1 AND deleted_at IS NULL
      `,
      [role],
    );

    return res.rows;
  }

  async findShipperOrThrow(id: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users" WHERE id=$1 AND role=$2
      `,
      [id, UserRole.SHIPPER],
    );

    const user = res.rows[0];

    if (!user) {
      throw new Error('Shipper not found');
    }
    return user;
  }
}
