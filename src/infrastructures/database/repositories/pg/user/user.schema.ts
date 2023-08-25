import { SchemaBase } from '@base/database/repositories/pg';

export class UserSchema extends SchemaBase {
  username: string;
  hashed?: string;
  role: string;
  address?: string;
  full_name?: string;
}
