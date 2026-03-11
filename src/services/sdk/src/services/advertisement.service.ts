import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import {
  Advertisement,
  ConsentLoginResponse,
  ConsentTemplate,
  SubscriberConsentUpdate,
} from '../models/dashboard'

export class AdvertisementService extends BaseService {
  public async login(
    regionId: string,
    subscriberId: string,
    platform: string,
    language: string,
  ): Promise<ConsentLoginResponse> {
    return this.httpClient.get<ConsentLoginResponse>(
      `${API_ENDPOINTS.ADTV}/${regionId}/login/${subscriberId}`,
      {
        params: { platform, language },
      },
    )
  }

  public async getNextAdvertisement(
    subscriberId: string,
    clientId: string,
    placementId: string,
  ): Promise<Advertisement | null> {
    return this.httpClient.get<Advertisement | null>(`${API_ENDPOINTS.ADTV}/${subscriberId}/ad`, {
      params: { clientId, placementId },
    })
  }

  public async getAdImage(subscriberId: string, hash: number): Promise<any> {
    // Returns response body (blob) usually, but here just raw
    return this.httpClient.get<any>(`${API_ENDPOINTS.ADTV}/${subscriberId}/ad/image/${hash}`)
  }

  public async logImpression(subscriberId: string, hash: number): Promise<Advertisement | null> {
    return this.httpClient.post<Advertisement | null>(
      `${API_ENDPOINTS.ADTV}/${subscriberId}/ad/track/${hash}`,
    )
  }

  public async getConsentTemplate(
    regionId: string,
    subscriberId: string,
    clientId: string,
    language: string,
  ): Promise<ConsentTemplate> {
    return this.httpClient.get<ConsentTemplate>(
      `${API_ENDPOINTS.ADTV}/${regionId}/consent/${subscriberId}`,
      {
        params: { clientId, language },
      },
    )
  }

  public async updateSubscriberConsentPreference(
    regionId: string,
    subscriberId: string,
    clientId: string,
    subscriberConsentUpdate: SubscriberConsentUpdate,
  ): Promise<void> {
    return this.httpClient.put<void>(
      `${API_ENDPOINTS.ADTV}/${regionId}/consent/${subscriberId}`,
      subscriberConsentUpdate,
      {
        params: { clientId },
      },
    )
  }
}
