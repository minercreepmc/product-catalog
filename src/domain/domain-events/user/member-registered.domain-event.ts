import { UserAggregate } from '@aggregates/user/user.aggregate';
import { DomainEventBase } from '@base/domain';
import {
  UserIdValueObject,
  UserNameValueObject,
  UserRoleValueObject,
} from '@value-objects/user';

export interface MemberRegisteredDomainEventDetails {
  id: UserIdValueObject;
  username: UserNameValueObject;
  role: UserRoleValueObject;
}

export class MemberRegisteredDomainEvent
  extends DomainEventBase
  implements MemberRegisteredDomainEventDetails
{
  constructor(options: MemberRegisteredDomainEventDetails) {
    super({
      eventName: MemberRegisteredDomainEvent.name,
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
