import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { SearchResult, SearchParams } from '../models/content'

export class SearchService extends BaseService {
  public async search(
    regionId: string,
    userId: string,
    params: SearchParams,
  ): Promise<SearchResult[]> {
    return this.httpClient.get<SearchResult[]>(`${API_ENDPOINTS.BS}/${regionId}/${userId}/search`, {
      params: params as any,
    })
  }
}
