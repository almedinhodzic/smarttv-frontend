import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import {
  User,
  StringApiListResponse,
  GetUserProfilesParams,
  AddUserParams,
  SaveUserInfoParams,
  DeleteUserParams,
  UserProfilesResponse,
} from '../models'

export class UserService extends BaseService {
  public async validateAccess(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<any> {
    return this.httpClient.get(`${API_ENDPOINTS.BS}/${regionId}/${userId}/validate-access`, {
      params,
    })
  }

  public async deleteUser(
    regionId: string,
    userId: string,
    targetUserId: string,
    params: DeleteUserParams,
  ): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/profiles/${targetUserId}`,
      { params: params as any },
    )
  }

  public async addUser(
    regionId: string,
    userId: string,
    params: AddUserParams,
    tag?: string,
  ): Promise<User> {
    return this.httpClient.post<User>(`${API_ENDPOINTS.BS}/${regionId}/${userId}/profiles`, null, {
      params: params as any,
    })
  }

  public async getUserProfiles(
    regionId: string,
    subscriberId: string,
    params?: GetUserProfilesParams,
  ): Promise<UserProfilesResponse> {
    return this.httpClient.get<UserProfilesResponse>(
      `${API_ENDPOINTS.BS}/${regionId}/subscribers/${subscriberId}/profiles`,
      { params: params as any },
    )
  }

  public async saveUserInfo(
    regionId: string,
    userId: string,
    targetUserId: string,
    params: SaveUserInfoParams,
  ): Promise<User> {
    return this.httpClient.put<User>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/profiles/${targetUserId}`,
      null,
      { params: params as any },
    )
  }

  public async getAvatars(regionId: string): Promise<any> {
    return this.httpClient.get(`${API_ENDPOINTS.BS}/${regionId}/avatars`)
  }

  public async getParentalHiddenChannels(
    regionId: string,
    userId: string,
    targetUserId: string,
  ): Promise<StringApiListResponse> {
    return this.httpClient.get<StringApiListResponse>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/profiles/channels/hidden/${targetUserId}`,
    )
  }

  public async saveParentalHiddenChannels(
    regionId: string,
    userId: string,
    targetUserId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/profiles/channels/hidden/${targetUserId}`,
      null,
      { params },
    )
  }

  public async signOut(): Promise<void> {
    return this.httpClient.post<void>(`${API_ENDPOINTS.IDM}/logout`)
  }

  public async deleteUserAccount(): Promise<void> {
    return this.httpClient.delete<void>(`${API_ENDPOINTS.IDM}/user`)
  }

  public async validateProfilePin(
    profileId: number,
    pin: string,
    kind: string = 'system',
  ): Promise<void> {
    return this.httpClient.postJson<void>(
      `${API_ENDPOINTS.WBE}/profiles/${profileId}/validate-pin`,
      { pin, kind },
    )
  }
}
