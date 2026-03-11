import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'

export class ConfigurationService extends BaseService {
  public async getConfigurations(regionId: string): Promise<any> {
    return this.httpClient.get<any>(`${API_ENDPOINTS.BS}/${regionId}/system/configuration`)
  }
}
