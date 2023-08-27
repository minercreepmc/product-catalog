export class V1UserModel {
  username: string;
  password: string;
  role: string;
  full_name?: string | undefined;
  id: string;
}

export class RequestWithUser {
  user: V1UserModel;
}
