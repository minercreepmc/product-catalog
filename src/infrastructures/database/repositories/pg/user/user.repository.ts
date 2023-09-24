import { PaginationParams, UpdateUserDto } from '@api/http';
import { DatabaseService } from '@config/pg';
import { Injectable } from '@nestjs/common';
import { UserRoleEnum } from '@value-objects/user';
import { plainToInstance } from 'class-transformer';
import { UserSchema } from './user.schema';

@Injectable()
export class UserRepository {
  async create(entity: UserSchema): Promise<UserSchema | null> {
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
      [
        entity.id,
        entity.username,
        entity.hashed,
        entity.role,
        entity.full_name,
      ],
    );

    return plainToInstance(UserSchema, res.rows[0]);
  }

  async deleteOneById(id: string): Promise<UserSchema | null> {
    const res = await this.databaseService.runQuery(
      `
      UPDATE "users" SET deleted_at=now() WHERE id=$1 AND deleted_at IS NULL RETURNING *
    `,
      [id],
    );

    return plainToInstance(UserSchema, res.rows[0]);
  }

  async findOneById(id: string): Promise<UserSchema | null> {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users" WHERE id=$1 AND deleted_at IS NULL
      `,
      [id],
    );

    return plainToInstance(UserSchema, res.rows[0]);
  }
  async updateOneById(
    id: string,
    newState: UpdateUserDto,
  ): Promise<UserSchema | null> {
    const res = await this.databaseService.runQuery(
      `
      UPDATE "users" SET full_name=coalesce($2, full_name), hashed=coalesce($3, hashed) WHERE id=$1 AND deleted_at IS NULL RETURNING *;
      `,
      [id, newState.fullName, newState.password],
    );

    const updated = res.rows[0];

    return updated;
  }

  async findOneByName(name: string): Promise<UserSchema | null> {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users" WHERE username=$1 AND deleted_at IS NULL
      `,
      [name],
    );

    const model = res.rows[0];

    return model;
  }

  async findAll(filter?: PaginationParams): Promise<UserSchema[]> {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users" WHERE deleted_at IS NULL
      OFFSET $1 LIMIT $2
      `,
      [filter?.offset, filter?.limit],
    );

    return res.rows;
  }

  async findAllByRole(role: string): Promise<UserSchema[]> {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users" WHERE role=$1 AND deleted_at IS NULL
      `,
      [role],
    );

    return res.rows;
  }

  async findShipperOrThrow(id: string): Promise<UserSchema> {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users" WHERE id=$1 AND role=$2
      `,
      [id, UserRoleEnum.Shipper],
    );

    const user = res.rows[0];

    if (!user) {
      throw new Error('Shipper not found');
    }
    return user;
  }

  constructor(private readonly databaseService: DatabaseService) {}
}
