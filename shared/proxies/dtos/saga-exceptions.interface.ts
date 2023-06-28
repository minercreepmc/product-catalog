/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import { Struct } from "../../../google/protobuf/struct";

export const protobufPackage = "";

export interface ISagaExceptions {
  name: string;
  exceptions: { [key: string]: any }[];
}

function createBaseISagaExceptions(): ISagaExceptions {
  return { name: "", exceptions: [] };
}

export const ISagaExceptions = {
  encode(message: ISagaExceptions, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    for (const v of message.exceptions) {
      Struct.encode(Struct.wrap(v!), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ISagaExceptions {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseISagaExceptions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.exceptions.push(Struct.unwrap(Struct.decode(reader, reader.uint32())));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ISagaExceptions {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      exceptions: Array.isArray(object?.exceptions) ? [...object.exceptions] : [],
    };
  },

  toJSON(message: ISagaExceptions): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    if (message.exceptions) {
      obj.exceptions = message.exceptions.map((e) => e);
    } else {
      obj.exceptions = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ISagaExceptions>, I>>(base?: I): ISagaExceptions {
    return ISagaExceptions.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ISagaExceptions>, I>>(object: I): ISagaExceptions {
    const message = createBaseISagaExceptions();
    message.name = object.name ?? "";
    message.exceptions = object.exceptions?.map((e) => e) || [];
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
