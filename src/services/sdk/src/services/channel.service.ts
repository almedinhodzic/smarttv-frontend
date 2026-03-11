import { BaseService } from "./base.service";
import { API_ENDPOINTS } from "../config";
import {
  ChannelCategory,
  UserChannelCategory,
  ChannelApiListResponse,
} from "../models/channel";

export class ChannelService extends BaseService {
  public async getChannels(
    regionId: string,
    params: Record<string, string>,
  ): Promise<ChannelApiListResponse> {
    return this.httpClient.get<ChannelApiListResponse>(
      `${API_ENDPOINTS.BS}/${regionId}/channels`,
      {
        params,
      },
    );
  }

  public async getUserChannels(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<ChannelApiListResponse> {
    return this.httpClient.get<ChannelApiListResponse>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/profiles/channel-changes`,
      { params },
    );
  }

  public async getMosaicChannels(
    regionId: string,
    params: Record<string, string>,
  ): Promise<ChannelApiListResponse> {
    return this.httpClient.get<ChannelApiListResponse>(
      `${API_ENDPOINTS.BS}/${regionId}/channel-mosaics`,
      { params },
    );
  }

  public async getCategories(
    regionId: string,
    params: Record<string, string>,
  ): Promise<ChannelCategory[]> {
    return this.httpClient.get<ChannelCategory[]>(
      `${API_ENDPOINTS.BS}/${regionId}/channels/categories`,
      { params },
    );
  }

  public async getUserCategories(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<UserChannelCategory[]> {
    return this.httpClient.get<UserChannelCategory[]>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/profiles/channels/categories`,
      { params },
    );
  }

  public async saveChannelsForCategory(
    regionId: string,
    userId: string,
    channelCategoryId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/profiles/channels/categories/${channelCategoryId}`,
      null,
      { params },
    );
  }

  public async saveChannelInfo(
    regionId: string,
    userId: string,
    channelId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.put<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/profiles/channel-changes/${channelId}`,
      null,
      { params },
    );
  }

  public async changeChannelNumbers(
    regionId: string,
    userId: string,
    jsonObject: string,
    deviceUid: string,
  ): Promise<void> {
    const params = new URLSearchParams();
    params.append("json", jsonObject);
    params.append("device_uid", deviceUid);
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/profiles/channels/numbers`,
      params,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );
  }

  public async changeChannelNames(
    regionId: string,
    userId: string,
    jsonObject: string,
    deviceUid: string,
  ): Promise<void> {
    const params = new URLSearchParams();
    params.append("json", jsonObject);
    params.append("device_uid", deviceUid);
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/profiles/channels/names`,
      params,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );
  }

  public async resetChannelsOrder(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/profiles/channels/order`,
      { params },
    );
  }
}
