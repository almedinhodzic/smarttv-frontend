import { BaseService } from "./base.service";
import { MediaResourceToken } from "../models/advanced";

export class TokenizationService extends BaseService {
  public async getToken(url: string): Promise<MediaResourceToken> {
    return this.httpClient.get<MediaResourceToken>(url);
  }

  public async keepAlive(url: string): Promise<void> {
    return this.httpClient.get<void>(url);
  }
}
