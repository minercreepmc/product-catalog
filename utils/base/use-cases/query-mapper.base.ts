export abstract class QueryMapperBase<ResponseDto> {
  abstract toQuery(dto: any): any;
  abstract toResponseDto(processResponse: any): ResponseDto;
}
