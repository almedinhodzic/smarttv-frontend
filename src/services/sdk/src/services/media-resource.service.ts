import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { MediaResourceOrchestration } from '../models/content'

export class MediaResourceService extends BaseService {
  public async getMediaResourceOrchestration(
    regionId: string,
    userId: string,
  ): Promise<MediaResourceOrchestration> {
    return this.httpClient.get<MediaResourceOrchestration>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/content/mr-orchestration`,
    )
  }
}
