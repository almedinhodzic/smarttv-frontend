import { BaseService } from "./base.service";
import { API_ENDPOINTS } from "../config";

export class TimeshiftService extends BaseService {
  public async getTimeshiftChannelInfoList(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<any> {
    return this.httpClient.get(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/recordings/timeshift`,
      { params },
    );
  }
}
