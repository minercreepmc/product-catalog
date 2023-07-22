import { v1, v5 } from 'uuid';

export function randomString() {
  return v5(v1(), process.env.NAMESPACE);
}
