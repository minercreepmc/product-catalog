export class CreateReviewerHttpResponse {
  readonly reviewerId: string;
  readonly name: string;
  readonly email: string;

  constructor(options: CreateReviewerHttpResponse) {
    const { reviewerId, name, email } = options;
    this.reviewerId = reviewerId;
    this.name = name;
    this.email = email;
  }
}
