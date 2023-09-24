export class V1UpdateProfileHttpRequest {
  fullName?: string;
  password?: string;
}

export class V1UpdateProfileHttpResponse {
  fullName?: string;
  password?: string;

  constructor(options: V1UpdateProfileHttpResponse) {
    this.fullName = options.fullName;
    this.password = options.password;
  }
}
