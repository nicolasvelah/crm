interface HttpError {
  statusCode: number;
  message: string;
}

export default class HttpResponse<T> {
  data?: T;

  error?: HttpError;

  constructor(data?: T, error?: HttpError) {
    this.data = data;
    this.error = error;
  }

  public static success<T>(data: T): HttpResponse<T> {
    return new HttpResponse<T>(data, undefined);
  }

  public static fail<T>(error: HttpError): HttpResponse<T> {
    return new HttpResponse<T>(undefined, error);
  }
}
