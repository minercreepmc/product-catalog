export abstract class UseCaseMapperBase<ResponseDto> {
  abstract toCommand(dto: any): any;
  abstract toResponseDto(event: any): ResponseDto;
}
