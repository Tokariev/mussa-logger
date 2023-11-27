interface TechnicalData {
  label: string;
  tag: string;
  value: string;
}

interface PriceRating {
  rating: string;
  rating_reason: string;
  threshold: string[];
}

export class CarDto {
  id: number;
  url: string;
  ad_status: string;
  source: string;
  brand: string;
  model: string;
  year: string;
  body_type: string;
  fuel_type: string;
  model_variant: string;

  description: string;
  technical_data: Array<TechnicalData>;
  seller_phone: Array<string>;
  equipment: Array<string>;
  price: number;
  price_rating: PriceRating;
  has_value_added_tax: boolean;
  is_negotiation_basis: boolean;
  seller_type: string;

  postal_code: string;
  city: string;
  photo_urls: string;
  has_full_service_history: boolean;
  has_car_accident: boolean;
  // published_at: string;
}
