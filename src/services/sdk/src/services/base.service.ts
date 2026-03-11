import { HttpClient } from "../http-client";

export abstract class BaseService {
  protected httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }
}
