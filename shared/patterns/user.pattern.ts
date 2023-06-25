/* eslint-disable */

export const protobufPackage = "";

export enum V1UserPattern {
  CREATE_MEMBER = 0,
  UNRECOGNIZED = -1,
}

export function v1UserPatternFromJSON(object: any): V1UserPattern {
  switch (object) {
    case 0:
    case "CREATE_MEMBER":
      return V1UserPattern.CREATE_MEMBER;
    case -1:
    case "UNRECOGNIZED":
    default:
      return V1UserPattern.UNRECOGNIZED;
  }
}

export function v1UserPatternToJSON(object: V1UserPattern): string {
  switch (object) {
    case V1UserPattern.CREATE_MEMBER:
      return "CREATE_MEMBER";
    case V1UserPattern.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
