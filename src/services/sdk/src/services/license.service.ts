import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'

export class LicenseService extends BaseService {
  public async getLicenses(regionId: string, userId: string): Promise<any> {
    return this.httpClient.get(`${API_ENDPOINTS.BS}/${regionId}/${userId}/access/features`)
  }
}
