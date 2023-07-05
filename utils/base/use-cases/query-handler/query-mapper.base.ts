export abstract class QueryMapperBase {
  abstract toQuery(dto: any): any;
  abstract toResponseDto(processResponse: any): any;
}
