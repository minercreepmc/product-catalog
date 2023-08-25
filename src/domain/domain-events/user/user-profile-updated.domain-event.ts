import { UserAggregate } from '@aggregates/user';
import { DomainEventBase } from '@base/domain';
import {
  UserAddressValueObject,
  UserFullNameValueObject,
  UserIdValueObject,
  UserPasswordValueObject,
} from '@value-objects/user';

export interface UserProfileUpdatedDomainEventDetails {
  id: UserIdValueObject;
  address?: UserAddressValueObject;
  fullName?: UserFullNameValueObject;
  password?: UserPasswordValueObject;
}

export class ProfileUpdatedDomainEvent
  extends DomainEventBase
  implements UserProfileUpdatedDomainEventDetails
{
  constructor(options: UserProfileUpdatedDomainEventDetails) {
    super({
      eventName: ProfileUpdatedDomainEvent.name,
      entityType: UserAggregate.name,
    });
    const { id, address, fullName, password } = options;

    this.id = id;
    this.address = address;
    this.fullName = fullName;
    this.password = password;
  }
  id: UserIdValueObject;
  address?: UserAddressValueObject;
  fullName?: UserFullNameValueObject;
  password?: UserPasswordValueObject;
}
