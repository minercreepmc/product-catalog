export class UserCreatedEvent {
  userId: string;
  constructor(data: UserCreatedEvent) {
    this.userId = data.userId;
  }
}
