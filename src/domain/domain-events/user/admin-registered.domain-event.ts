import { UserAggregate } from '@aggregates/user';
import { DomainEventBase } from '@base/domain';
import {
  UserIdValueObject,
  UserNameValueObject,
  UserRoleValueObject,
} from '@value-objects/user';

export interface AdminRegisteredDomainEventDetails {
  id: UserIdValueObject;
  username: UserNameValueObject;
  role: UserRoleValueObject;
}

export class AdminRegisteredDomainEvent
  extends DomainEventBase
  implements AdminRegisteredDomainEventDetails
{
  constructor(options: AdminRegisteredDomainEventDetails) {
    super({
      eventName: AdminRegisteredDomainEvent.name,
      entityType: UserAggregate.name,
    });
    this.id = options.id;
    this.username = options.username;
    this.role = options.role;
  }
  id: UserIdValueObject;
  username: UserNameValueObject;
  role: UserRoleValueObject;
}
