export class V1LogInAdminHttpRequest {
  username: string;
  password: string;
}

export class V1LogInAdminHttpResponse {
  cookie: string;
  constructor(options: V1LogInAdminHttpResponse) {
    this.cookie = options.cookie;
  }
}
