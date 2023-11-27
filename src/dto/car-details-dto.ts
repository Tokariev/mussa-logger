export class CarDetailsDto {
  id: number;
  searchUrl: string;
  sourceUrl: string;
  brand: string;
  model: string;
  package: string;
  bodyType: string;
  seatsCount: string;
  prices: object[];
  numResultsTotal: number;
}
