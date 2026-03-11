import { BaseService } from './base.service'

export class DownloadService extends BaseService {
  public async downloadImage(url: string): Promise<any> {
    // Usually binary data, axios returns blob/arraybuffer if configured, else text
    return this.httpClient.get<any>(url, { responseType: 'blob' })
  }
}
