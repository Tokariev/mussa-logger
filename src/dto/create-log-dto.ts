export class CreateRequestLogDto {
  readonly method: string;
  readonly url: string;
  readonly requestBody?: any;
  readonly responseStatus?: number;
  readonly responseBody?: any;
}
