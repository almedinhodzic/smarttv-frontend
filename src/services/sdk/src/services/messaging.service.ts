import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import {
  MessageInfo,
  ServerMessagesResponse,
  ServerMessagesStatus,
  ApplicationInfoDto,
  PushNotificationsDeviceInfoDto,
  PushNotificationsPushMsgInfoDto,
} from '../models/messaging'

export class MessagingService extends BaseService {
  public async getPersonalMessages(
    profileUid: string,
    deviceId: string,
    params: Record<string, string>,
  ): Promise<ServerMessagesResponse> {
    return this.httpClient.get<ServerMessagesResponse>(
      `${API_ENDPOINTS.MSG}/messages/profiles/${profileUid}/devices/${deviceId}`,
      { params },
    )
  }

  public async getAllPersonalMessages(
    profileUid: string,
    deviceId: string,
    params: Record<string, string>,
  ): Promise<any> {
    return this.httpClient.get(
      `${API_ENDPOINTS.MSG}/messages/profiles/${profileUid}/devices/${deviceId}`,
      { params },
    )
  }

  public async acknowledgeMessages(messageInfo: MessageInfo): Promise<void> {
    return this.httpClient.post<void>(`${API_ENDPOINTS.MSG}/messages/acknowledged`, messageInfo)
  }

  public async markMessagesAsRead(messageInfo: MessageInfo): Promise<void> {
    return this.httpClient.post<void>(`${API_ENDPOINTS.MSG}/messages/read`, messageInfo)
  }

  public async getMessagesStatus(
    profileUid: string,
    deviceId: string,
  ): Promise<ServerMessagesStatus> {
    return this.httpClient.get<ServerMessagesStatus>(
      `${API_ENDPOINTS.MSG}/messages/profiles/${profileUid}/devices/${deviceId}/status`,
    )
  }

  public async deleteMessage(
    messageId: string,
    profileUid: string,
    deviceId: string,
    applicationInfoDto: ApplicationInfoDto,
  ): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.MSG}/messages/${messageId}/profiles/${profileUid}/devices/${deviceId}`,
      {
        data: applicationInfoDto,
      },
    )
  }

  public async registerDeviceForPushNotifications(
    info: PushNotificationsDeviceInfoDto,
  ): Promise<void> {
    return this.httpClient.post<void>(`${API_ENDPOINTS.MSG}/devices`, info)
  }

  public async updateDeviceForPushNotifications(
    deviceId: string,
    info: PushNotificationsPushMsgInfoDto,
  ): Promise<void> {
    // Axios has patch
    return this.httpClient['axiosInstance'].patch(`${API_ENDPOINTS.MSG}/devices/${deviceId}`, info)
  }
}
