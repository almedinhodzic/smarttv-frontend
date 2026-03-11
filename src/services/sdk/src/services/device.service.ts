import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { UserDevice, DeleteDeviceInfo } from '../models/core'

export class DeviceService extends BaseService {
  public async getDevices(regionId: string, userId: string): Promise<UserDevice[]> {
    return this.httpClient.get<UserDevice[]>(`${API_ENDPOINTS.BS}/${regionId}/${userId}/devices`)
  }

  public async removeDevice(
    regionId: string,
    userId: string,
    deviceId: string,
    targetUserId: string,
  ): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/devices/${deviceId}`,
      {
        params: { target_user_id: targetUserId },
      },
    )
  }

  public async removeDeviceWithToken(passwordInfo: DeleteDeviceInfo): Promise<void> {
    // Retrofit @HTTP(hasBody=true) means we send a body with DELETE
    return this.httpClient.delete<void>(`${API_ENDPOINTS.IDM}/devices`, {
      data: passwordInfo,
    })
  }

  public async renameDevice(
    regionId: string,
    userId: string,
    deviceId: string,
    params: Record<string, string>,
  ): Promise<void> {
    // Note: The path in DeviceRestApi was hardcoded: /restapi/rest/{regionId}/{userId}/devices/{deviceId}
    // This is different from PlatformApi.BS. We should respect the hardcoded path from the Kotlin file.
    return this.httpClient.put<void>(
      `/restapi/rest/${regionId}/${userId}/devices/${deviceId}`,
      null,
      { params },
    )
  }
}
