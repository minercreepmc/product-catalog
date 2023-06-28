/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "";

export enum V1UserPattern {
  REGISTER_MEMBER = 0,
  UNRECOGNIZED = -1,
}

export function v1UserPatternFromJSON(object: any): V1UserPattern {
  switch (object) {
    case 0:
    case "REGISTER_MEMBER":
      return V1UserPattern.REGISTER_MEMBER;
    case -1:
    case "UNRECOGNIZED":
    default:
      return V1UserPattern.UNRECOGNIZED;
  }
}

export function v1UserPatternToJSON(object: V1UserPattern): string {
  switch (object) {
    case V1UserPattern.REGISTER_MEMBER:
      return "REGISTER_MEMBER";
    case V1UserPattern.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface V1RegisterMemberRequestDto {
  username: string;
  email: string;
  password: string;
}

export interface V1RegisterMemberResponseDto {
  username: string;
  email: string;
}

function createBaseV1RegisterMemberRequestDto(): V1RegisterMemberRequestDto {
  return { username: "", email: "", password: "" };
}

export const V1RegisterMemberRequestDto = {
  encode(message: V1RegisterMemberRequestDto, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.email !== "") {
      writer.uint32(18).string(message.email);
    }
    if (message.password !== "") {
      writer.uint32(26).string(message.password);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): V1RegisterMemberRequestDto {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseV1RegisterMemberRequestDto();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.username = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.email = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.password = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): V1RegisterMemberRequestDto {
    return {
      username: isSet(object.username) ? String(object.username) : "",
      email: isSet(object.email) ? String(object.email) : "",
      password: isSet(object.password) ? String(object.password) : "",
    };
  },

  toJSON(message: V1RegisterMemberRequestDto): unknown {
    const obj: any = {};
    message.username !== undefined && (obj.username = message.username);
    message.email !== undefined && (obj.email = message.email);
    message.password !== undefined && (obj.password = message.password);
    return obj;
  },

  create<I extends Exact<DeepPartial<V1RegisterMemberRequestDto>, I>>(base?: I): V1RegisterMemberRequestDto {
    return V1RegisterMemberRequestDto.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<V1RegisterMemberRequestDto>, I>>(object: I): V1RegisterMemberRequestDto {
    const message = createBaseV1RegisterMemberRequestDto();
    message.username = object.username ?? "";
    message.email = object.email ?? "";
    message.password = object.password ?? "";
    return message;
  },
};

function createBaseV1RegisterMemberResponseDto(): V1RegisterMemberResponseDto {
  return { username: "", email: "" };
}

export const V1RegisterMemberResponseDto = {
  encode(message: V1RegisterMemberResponseDto, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.email !== "") {
      writer.uint32(18).string(message.email);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): V1RegisterMemberResponseDto {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseV1RegisterMemberResponseDto();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.username = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.email = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): V1RegisterMemberResponseDto {
    return {
      username: isSet(object.username) ? String(object.username) : "",
      email: isSet(object.email) ? String(object.email) : "",
    };
  },

  toJSON(message: V1RegisterMemberResponseDto): unknown {
    const obj: any = {};
    message.username !== undefined && (obj.username = message.username);
    message.email !== undefined && (obj.email = message.email);
    return obj;
  },

  create<I extends Exact<DeepPartial<V1RegisterMemberResponseDto>, I>>(base?: I): V1RegisterMemberResponseDto {
    return V1RegisterMemberResponseDto.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<V1RegisterMemberResponseDto>, I>>(object: I): V1RegisterMemberResponseDto {
    const message = createBaseV1RegisterMemberResponseDto();
    message.username = object.username ?? "";
    message.email = object.email ?? "";
    return message;
  },
};

export interface V1UserInterface {
  registerMember(request: V1RegisterMemberRequestDto): Promise<V1RegisterMemberResponseDto>;
}

export class V1UserInterfaceClientImpl implements V1UserInterface {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "V1UserInterface";
    this.rpc = rpc;
    this.registerMember = this.registerMember.bind(this);
  }
  registerMember(request: V1RegisterMemberRequestDto): Promise<V1RegisterMemberResponseDto> {
    const data = V1RegisterMemberRequestDto.encode(request).finish();
    const promise = this.rpc.request(this.service, "registerMember", data);
    return promise.then((data) => V1RegisterMemberResponseDto.decode(_m0.Reader.create(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

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
