export class CarDetailsDto {
  searchUrl: string;
  sourceUrl: string;
  externalCarId: string;
  brand: string;
  model: string;
  package: string;
  bodyType: string;
  seatsCount: string;
  prices: object[];
  numResultsTotal: number;
  observableDataHash: string;
}
