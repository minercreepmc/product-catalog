/* eslint-disable */

export const protobufPackage = "";

export enum MessageTypes {
  PROTOBUF = 0,
  JSON = 1,
  UNRECOGNIZED = -1,
}

export function messageTypesFromJSON(object: any): MessageTypes {
  switch (object) {
    case 0:
    case "PROTOBUF":
      return MessageTypes.PROTOBUF;
    case 1:
    case "JSON":
      return MessageTypes.JSON;
    case -1:
    case "UNRECOGNIZED":
    default:
      return MessageTypes.UNRECOGNIZED;
  }
}

export function messageTypesToJSON(object: MessageTypes): string {
  switch (object) {
    case MessageTypes.PROTOBUF:
      return "PROTOBUF";
    case MessageTypes.JSON:
      return "JSON";
    case MessageTypes.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
