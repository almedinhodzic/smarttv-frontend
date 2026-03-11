import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { SystemInfo, LanguageInfo } from '../models/core'

export class SystemService extends BaseService {
  public async getSystemInfo(): Promise<SystemInfo> {
    return this.httpClient.get<SystemInfo>(`${API_ENDPOINTS.BS}/system/info`)
  }

  public async getTranslations(): Promise<any> {
    return this.httpClient.get<any>(`${API_ENDPOINTS.BS}/system/translations`)
  }

  public async getLanguageInfos(regionId: string): Promise<LanguageInfo[]> {
    return this.httpClient.get<LanguageInfo[]>(`${API_ENDPOINTS.BS}/${regionId}/languages`)
  }
}
