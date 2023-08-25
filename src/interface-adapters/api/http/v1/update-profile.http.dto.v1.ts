export class V1UpdateProfileHttpRequest {
  address?: string;
  fullName?: string;
  password?: string;
}

export class V1UpdateProfileHttpResponse {
  address?: string;
  fullName?: string;
  password?: string;

  constructor(options: V1UpdateProfileHttpResponse) {
    this.address = options.address;
    this.fullName = options.fullName;
    this.password = options.password;
  }
}
