/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "";

export enum V1ProductPattern {
  CREATE_REVIEWER = 0,
  REMOVE_REVIEWER = 1,
  UNRECOGNIZED = -1,
}

export function v1ProductPatternFromJSON(object: any): V1ProductPattern {
  switch (object) {
    case 0:
    case "CREATE_REVIEWER":
      return V1ProductPattern.CREATE_REVIEWER;
    case 1:
    case "REMOVE_REVIEWER":
      return V1ProductPattern.REMOVE_REVIEWER;
    case -1:
    case "UNRECOGNIZED":
    default:
      return V1ProductPattern.UNRECOGNIZED;
  }
}

export function v1ProductPatternToJSON(object: V1ProductPattern): string {
  switch (object) {
    case V1ProductPattern.CREATE_REVIEWER:
      return "CREATE_REVIEWER";
    case V1ProductPattern.REMOVE_REVIEWER:
      return "REMOVE_REVIEWER";
    case V1ProductPattern.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface V1CreateReviewerRequestDto {
  name: string;
  role: string;
}

export interface V1CreateReviewerResponseDto {
  name: string;
  role: string;
}

export interface V1RemoveReviewerRequestDto {
  id: string;
}

export interface V1RemoveReviewerResponseDto {
  id: string;
}

function createBaseV1CreateReviewerRequestDto(): V1CreateReviewerRequestDto {
  return { name: "", role: "" };
}

export const V1CreateReviewerRequestDto = {
  encode(message: V1CreateReviewerRequestDto, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.role !== "") {
      writer.uint32(18).string(message.role);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): V1CreateReviewerRequestDto {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseV1CreateReviewerRequestDto();
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

          message.role = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): V1CreateReviewerRequestDto {
    return { name: isSet(object.name) ? String(object.name) : "", role: isSet(object.role) ? String(object.role) : "" };
  },

  toJSON(message: V1CreateReviewerRequestDto): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.role !== undefined && (obj.role = message.role);
    return obj;
  },

  create<I extends Exact<DeepPartial<V1CreateReviewerRequestDto>, I>>(base?: I): V1CreateReviewerRequestDto {
    return V1CreateReviewerRequestDto.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<V1CreateReviewerRequestDto>, I>>(object: I): V1CreateReviewerRequestDto {
    const message = createBaseV1CreateReviewerRequestDto();
    message.name = object.name ?? "";
    message.role = object.role ?? "";
    return message;
  },
};

function createBaseV1CreateReviewerResponseDto(): V1CreateReviewerResponseDto {
  return { name: "", role: "" };
}

export const V1CreateReviewerResponseDto = {
  encode(message: V1CreateReviewerResponseDto, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.role !== "") {
      writer.uint32(18).string(message.role);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): V1CreateReviewerResponseDto {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseV1CreateReviewerResponseDto();
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

          message.role = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): V1CreateReviewerResponseDto {
    return { name: isSet(object.name) ? String(object.name) : "", role: isSet(object.role) ? String(object.role) : "" };
  },

  toJSON(message: V1CreateReviewerResponseDto): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.role !== undefined && (obj.role = message.role);
    return obj;
  },

  create<I extends Exact<DeepPartial<V1CreateReviewerResponseDto>, I>>(base?: I): V1CreateReviewerResponseDto {
    return V1CreateReviewerResponseDto.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<V1CreateReviewerResponseDto>, I>>(object: I): V1CreateReviewerResponseDto {
    const message = createBaseV1CreateReviewerResponseDto();
    message.name = object.name ?? "";
    message.role = object.role ?? "";
    return message;
  },
};

function createBaseV1RemoveReviewerRequestDto(): V1RemoveReviewerRequestDto {
  return { id: "" };
}

export const V1RemoveReviewerRequestDto = {
  encode(message: V1RemoveReviewerRequestDto, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): V1RemoveReviewerRequestDto {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseV1RemoveReviewerRequestDto();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): V1RemoveReviewerRequestDto {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: V1RemoveReviewerRequestDto): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<V1RemoveReviewerRequestDto>, I>>(base?: I): V1RemoveReviewerRequestDto {
    return V1RemoveReviewerRequestDto.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<V1RemoveReviewerRequestDto>, I>>(object: I): V1RemoveReviewerRequestDto {
    const message = createBaseV1RemoveReviewerRequestDto();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseV1RemoveReviewerResponseDto(): V1RemoveReviewerResponseDto {
  return { id: "" };
}

export const V1RemoveReviewerResponseDto = {
  encode(message: V1RemoveReviewerResponseDto, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): V1RemoveReviewerResponseDto {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseV1RemoveReviewerResponseDto();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): V1RemoveReviewerResponseDto {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: V1RemoveReviewerResponseDto): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<V1RemoveReviewerResponseDto>, I>>(base?: I): V1RemoveReviewerResponseDto {
    return V1RemoveReviewerResponseDto.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<V1RemoveReviewerResponseDto>, I>>(object: I): V1RemoveReviewerResponseDto {
    const message = createBaseV1RemoveReviewerResponseDto();
    message.id = object.id ?? "";
    return message;
  },
};

export interface V1ProductInterface {
  createReviewer(request: V1CreateReviewerRequestDto): Promise<V1CreateReviewerResponseDto>;
  removeReviewer(request: V1RemoveReviewerRequestDto): Promise<V1CreateReviewerResponseDto>;
}

export class V1ProductInterfaceClientImpl implements V1ProductInterface {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "V1ProductInterface";
    this.rpc = rpc;
    this.createReviewer = this.createReviewer.bind(this);
    this.removeReviewer = this.removeReviewer.bind(this);
  }
  createReviewer(request: V1CreateReviewerRequestDto): Promise<V1CreateReviewerResponseDto> {
    const data = V1CreateReviewerRequestDto.encode(request).finish();
    const promise = this.rpc.request(this.service, "createReviewer", data);
    return promise.then((data) => V1CreateReviewerResponseDto.decode(_m0.Reader.create(data)));
  }

  removeReviewer(request: V1RemoveReviewerRequestDto): Promise<V1CreateReviewerResponseDto> {
    const data = V1RemoveReviewerRequestDto.encode(request).finish();
    const promise = this.rpc.request(this.service, "removeReviewer", data);
    return promise.then((data) => V1CreateReviewerResponseDto.decode(_m0.Reader.create(data)));
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
