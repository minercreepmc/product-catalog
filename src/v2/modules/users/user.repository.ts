import { DatabaseService } from '@config/database';
import { PaginationParams } from '@constants';
import { Injectable } from '@nestjs/common';
import { UserRole } from './constants';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(dto: CreateUserDto) {
    const { username, password, fullName, role, email, phone } = dto;
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO "users" (
        username,
        hashed,
        role,
        full_name,
        email,
        phone
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      ) RETURNING *
    `,
      [username, password, role, fullName, email, phone],
    );

    return res.rows[0];
  }

  async deleteOneById(id: string) {
    const res = await this.databaseService.runQuery(
      `
      DELETE FROM "users" WHERE id=$1 RETURNING *
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
      WHERE u.id=$1
      GROUP BY u.id
      `,
      [id],
    );

    return res.rows[0];
  }
  async updateOneById(id: string, newState: UpdateUserDto) {
    const { email, phone, fullName, password } = newState;
    const res = await this.databaseService.runQuery(
      `
      UPDATE "users" 
      SET full_name=coalesce($2, full_name), 
          hashed=coalesce($3, hashed) 
          phone=coalesce($4, phone),
          email=coalesce($5, email)
      WHERE id=$1 AND deleted_at IS NULL RETURNING *;
      `,
      [id, fullName, password, phone, email],
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
      SELECT u.id, u.username, u.full_name, u.email, u.phone, u.role
      from "users" u WHERE role=$1 AND deleted_at IS NULL
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
