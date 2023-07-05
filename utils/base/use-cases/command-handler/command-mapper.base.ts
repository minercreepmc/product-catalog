export abstract class CommandMapperBase<ResponseDto> {
  abstract toCommand(dto: any): any;
  abstract toResponseDto(event: any): ResponseDto;
}
