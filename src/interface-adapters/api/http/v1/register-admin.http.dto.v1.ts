export class V1RegisterAdminHttpRequest {
  username: string;
  password: string;
  fullName?: string;
}

export class V1RegisterAdminHttpResponse {
  id: string;
  username: string;
  fullName?: string;
  message?: string;

  constructor(dto: Omit<V1RegisterAdminHttpResponse, 'message'>) {
    this.id = dto.id;
    this.username = dto.username;
    this.fullName = dto.fullName;
    this.message = 'Member registered successfully.';
  }
}
