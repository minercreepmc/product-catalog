export class UserModel {
  username: string;
  password: string;
  role: string;
  full_name?: string | undefined;
  id: string;
}

export class RequestWithUser {
  user: UserModel;
}
