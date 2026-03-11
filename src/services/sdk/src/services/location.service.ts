import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { GeoRestriction } from '../models/misc'

export class LocationService extends BaseService {
  public async getCurrentLocationRestriction(): Promise<GeoRestriction> {
    return this.httpClient.get<GeoRestriction>(`${API_ENDPOINTS.GEO}/restrictions`)
  }
}
