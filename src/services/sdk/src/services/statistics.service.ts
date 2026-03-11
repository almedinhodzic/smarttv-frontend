import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'

export class StatisticsService extends BaseService {
  public async sendStatisticEvents(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<void> {
    const urlParams = new URLSearchParams()
    for (const key in params) {
      urlParams.append(key, params[key])
    }
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.STAT}/${regionId}/${userId}/events`,
      urlParams,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    )
  }

  public async getTopCurrentlyPlayingChannels(
    regionId: string,
    params: Record<string, string>,
  ): Promise<string[]> {
    return this.httpClient.get<string[]>(`${API_ENDPOINTS.STAT}/${regionId}/live/channels`, {
      params,
    })
  }
}
