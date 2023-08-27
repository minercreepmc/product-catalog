import { V1UserModel } from './models';

export class V1GetUsersHttpQuery {
  limit?: number;
  offset?: number;
}

export class V1GetUsersHttpResponse {
  users: V1UserModel[];
}
