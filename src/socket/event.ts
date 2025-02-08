type Data = {
  externalCarId: string;
} & {
  [key: string]: any; // Any other fields with string keys and any values
};

export class EventPayload {
  constructor(type: string, data: Data) {
    this.type = type;
    this.data = data;
  }

  type: string;
  data: Data;
}
