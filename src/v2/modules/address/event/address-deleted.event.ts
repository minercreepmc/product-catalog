export class AddressDeletedEvent {
  userId: string;
  constructor(dto: AddressDeletedEvent) {
    this.userId = dto.userId;
  }
}
