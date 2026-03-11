import { BaseService } from "./base.service";
import { API_ENDPOINTS } from "../config";
import { Toc, TocUpdateDto } from "../models/misc";

export class TermsOfConductService extends BaseService {
  public async getTermsOfConduct(userId: string): Promise<Toc[]> {
    return this.httpClient.get<Toc[]>(
      `${API_ENDPOINTS.TOC}/user-agreement/${userId}`,
    );
  }

  public async updateTermsOfConduct(
    userId: string,
    body: TocUpdateDto[],
  ): Promise<void> {
    return this.httpClient.put<void>(
      `${API_ENDPOINTS.TOC}/user-agreement/${userId}`,
      body,
    );
  }

  public async hasTermsOfConduct(userId: string): Promise<boolean> {
    return this.httpClient.get<boolean>(
      `${API_ENDPOINTS.TOC}/user-agreement/has-user-agreements/${userId}`,
    );
  }
}
