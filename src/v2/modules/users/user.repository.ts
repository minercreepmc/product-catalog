import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@config/database';
import type { PaginationParams } from '@constants';
import { USERS_ROLE } from './constants';
import type { CreateUserDto, ShipperGetAllDto, UpdateUserDto } from './dto';
import { KyselyDatabase } from '@config/kysely';
import { paginate } from '@common/function';

@Injectable()
export class UserRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly database: KyselyDatabase,
  ) {}

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
          hashed=coalesce($3, hashed),
          phone=coalesce($4, phone),
          email=coalesce($5, email)
      WHERE id=$1 RETURNING *;
      `,
      [id, fullName, password, phone, email],
    );

    return res.rows[0];
  }

  async findOneByName(name: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users" WHERE username=$1;
      `,
      [name],
    );

    return res.rows[0];
  }

  async findAll(filter?: PaginationParams) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users"
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
      from "users" u WHERE role=$1`,
      [role],
    );

    return res.rows;
  }

  async findShipperOrThrow(id: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from "users" WHERE id=$1 AND role=$2
      `,
      [id, USERS_ROLE.SHIPPER],
    );

    const user = res.rows[0];

    if (!user) {
      throw new Error('Shipper not found');
    }
    return user;
  }

  async countDailyMember() {
    const res = await this.databaseService.runQuery(
      `
      SELECT COUNT(*) as count
      FROM users
      WHERE role = $1
        AND date_trunc('day', created_at) = date_trunc('day', current_date) 
      `,
      [USERS_ROLE.MEMBER],
    );
    return res.rows[0].count;
  }

  async countMonthlyMember() {
    const res = await this.databaseService.runQuery(
      `
      SELECT COUNT(*) as count
      FROM users
      WHERE role = $1
        AND date_trunc('month', created_at) = date_trunc('month', current_date) 
      `,
      [USERS_ROLE.MEMBER],
    );
    return res.rows[0].count;
  }

  async countWeeklyMember() {
    const res = await this.databaseService.runQuery(
      `
      SELECT COUNT(*) as count
      FROM users
      WHERE role = $1
        AND date_trunc('week', created_at) = date_trunc('week', current_date) 
      `,
      [USERS_ROLE.MEMBER],
    );
    return res.rows[0].count;
  }

  async getShippers(dto: ShipperGetAllDto) {
    const { limit, page } = dto;
    const query = this.database
      .selectFrom('users')
      .leftJoin('shipping', 'shipping.shipper_id', 'users.id')
      .select(({ fn }) => [
        'users.id',
        'users.username',
        'users.full_name',
        'users.email',
        'users.phone',
        'users.role',
        fn.count('shipping.id').as('shipping_count'),
      ])
      .where('role', '=', USERS_ROLE.SHIPPER)
      .groupBy('users.id');

    return paginate(query, this.database, {
      limit,
      page,
      tableName: 'users',
      getOriginalTotalItems: true,
    });
  }
}
