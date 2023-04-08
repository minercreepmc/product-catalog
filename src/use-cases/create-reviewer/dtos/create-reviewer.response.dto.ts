export class CreateReviewerResponseDto {
  readonly reviewerId: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly message: string;
  constructor(dtos: Omit<CreateReviewerResponseDto, 'message'>) {
    this.reviewerId = dtos.reviewerId;
    this.name = dtos.name;
    this.email = dtos.email;
    this.role = dtos.role;
    this.message = 'Reviewer created successfully';
  }
}
