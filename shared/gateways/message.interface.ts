/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import { Struct } from "../../google/protobuf/struct";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "";

export interface Message {
  header: Message_Header | undefined;
  content: { [key: string]: any } | undefined;
}

export interface Message_Header {
  messageType: string;
  source: string;
  destination: string;
  timestamp: Date | undefined;
}

function createBaseMessage(): Message {
  return { header: undefined, content: undefined };
}

export const Message = {
  encode(message: Message, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.header !== undefined) {
      Message_Header.encode(message.header, writer.uint32(10).fork()).ldelim();
    }
    if (message.content !== undefined) {
      Struct.encode(Struct.wrap(message.content), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Message {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.header = Message_Header.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.content = Struct.unwrap(Struct.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Message {
    return {
      header: isSet(object.header) ? Message_Header.fromJSON(object.header) : undefined,
      content: isObject(object.content) ? object.content : undefined,
    };
  },

  toJSON(message: Message): unknown {
    const obj: any = {};
    message.header !== undefined && (obj.header = message.header ? Message_Header.toJSON(message.header) : undefined);
    message.content !== undefined && (obj.content = message.content);
    return obj;
  },

  create<I extends Exact<DeepPartial<Message>, I>>(base?: I): Message {
    return Message.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Message>, I>>(object: I): Message {
    const message = createBaseMessage();
    message.header = (object.header !== undefined && object.header !== null)
      ? Message_Header.fromPartial(object.header)
      : undefined;
    message.content = object.content ?? undefined;
    return message;
  },
};

function createBaseMessage_Header(): Message_Header {
  return { messageType: "", source: "", destination: "", timestamp: undefined };
}

export const Message_Header = {
  encode(message: Message_Header, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.messageType !== "") {
      writer.uint32(10).string(message.messageType);
    }
    if (message.source !== "") {
      writer.uint32(18).string(message.source);
    }
    if (message.destination !== "") {
      writer.uint32(26).string(message.destination);
    }
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Message_Header {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessage_Header();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.messageType = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.source = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.destination = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Message_Header {
    return {
      messageType: isSet(object.messageType) ? String(object.messageType) : "",
      source: isSet(object.source) ? String(object.source) : "",
      destination: isSet(object.destination) ? String(object.destination) : "",
      timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined,
    };
  },

  toJSON(message: Message_Header): unknown {
    const obj: any = {};
    message.messageType !== undefined && (obj.messageType = message.messageType);
    message.source !== undefined && (obj.source = message.source);
    message.destination !== undefined && (obj.destination = message.destination);
    message.timestamp !== undefined && (obj.timestamp = message.timestamp.toISOString());
    return obj;
  },

  create<I extends Exact<DeepPartial<Message_Header>, I>>(base?: I): Message_Header {
    return Message_Header.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Message_Header>, I>>(object: I): Message_Header {
    const message = createBaseMessage_Header();
    message.messageType = object.messageType ?? "";
    message.source = object.source ?? "";
    message.destination = object.destination ?? "";
    message.timestamp = object.timestamp ?? undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
