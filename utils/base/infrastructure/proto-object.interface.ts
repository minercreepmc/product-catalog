import { Writer } from 'protobufjs'

export interface ProtoObject {
  encode(message: any, writer?: Writer): Writer;
}
