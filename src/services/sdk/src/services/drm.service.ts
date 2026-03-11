import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { VerimatrixDrmInfo } from '../models/advanced'

export class DrmService extends BaseService {
  public async grantAccessDrm(
    regionId: string,
    userId: string,
    deviceUid: string,
    params: Record<string, string>,
  ): Promise<VerimatrixDrmInfo> {
    return this.httpClient.post<VerimatrixDrmInfo>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/${deviceUid}/access/drm`,
      null,
      { params },
    )
  }

  public async getRedirectedUrl(url: string): Promise<any> {
    return this.httpClient.get(url)
  }
}
