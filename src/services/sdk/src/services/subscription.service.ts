import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { ActiveSubscription, SubscriptionGroup, Subscription } from '../models/transaction'

export class SubscriptionService extends BaseService {
  public async getSubscriptions(regionId: string): Promise<any> {
    return this.httpClient.get(`${API_ENDPOINTS.BS}/${regionId}/store/subscriptions`)
  }

  public async getActiveSubscriptions(
    regionId: string,
    userId: string,
  ): Promise<ActiveSubscription[]> {
    return this.httpClient.get<ActiveSubscription[]>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/store/active-subscriptions`,
    )
  }

  public async getSubscriptionGroups(regionId: string): Promise<SubscriptionGroup[]> {
    return this.httpClient.get<SubscriptionGroup[]>(
      `${API_ENDPOINTS.BS}/${regionId}/store/subscription-groups`,
    )
  }

  public async getSubscriptionDetails(
    regionId: string,
    subscriptionId: string,
  ): Promise<Subscription> {
    return this.httpClient.get<Subscription>(
      `${API_ENDPOINTS.BS}/${regionId}/store/subscriptions/${subscriptionId}`,
    )
  }

  public async purchaseSubscription(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/store/active-subscriptions`,
      null,
      { params },
    )
  }

  public async updateActiveSubscriptionStatus(
    regionId: string,
    userId: string,
    activeSubscriptionId: string,
    params: Record<string, string>,
  ): Promise<ActiveSubscription> {
    return this.httpClient.put<ActiveSubscription>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/store/active-subscriptions/${activeSubscriptionId}`,
      null,
      { params },
    )
  }
}
