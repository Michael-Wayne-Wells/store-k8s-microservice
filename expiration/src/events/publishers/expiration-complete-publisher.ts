import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@mwproducts/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
