import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import {
  DashboardRows,
  DashboardRecommendationProfile,
  DashboardRow,
  DashboardContentDetails,
  DashboardContentAction,
  DashboardItem,
  DashboardSeriesSeasons,
} from '../models/dashboard'

export class DashboardService extends BaseService {
  public async getHomeScreen(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<DashboardRows> {
    // Hardcoded path from interface
    return this.httpClient.get<DashboardRows>(
      `/restapi/tvdashboard/${regionId}/${userId}/home-screen`,
      { params },
    )
  }

  public async getRecommendationProfile(
    regionId: string,
    userId: string,
    profileUid: string,
  ): Promise<DashboardRecommendationProfile> {
    return this.httpClient.get<DashboardRecommendationProfile>(
      `/restapi/tvdashboard/${regionId}/${userId}/profile`,
      {
        headers: { 'X-Profile-Uid': profileUid },
      },
    )
  }

  public async updateRecommendationProfile(
    regionId: string,
    userId: string,
    profileUid: string,
    params: Record<string, string>,
    tag: string,
  ): Promise<void> {
    return this.httpClient.put<void>(`/restapi/tvdashboard/${regionId}/${userId}/profile`, null, {
      params,
      headers: { 'X-Profile-Uid': profileUid },
    })
  }

  public async getRow(url: string): Promise<DashboardRow> {
    return this.httpClient.get<DashboardRow>(url)
  }

  public async getCategories(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<DashboardRow> {
    return this.httpClient.get<DashboardRow>(
      `/restapi/tvdashboard/${regionId}/${userId}/categories`,
      { params },
    )
  }

  public async getSubcategories(url: string): Promise<DashboardRows> {
    return this.httpClient.get<DashboardRows>(url)
  }

  public async getSubcategoryContent(url: string): Promise<DashboardRow> {
    return this.httpClient.get<DashboardRow>(url)
  }

  public async getContentDetails(url: string): Promise<DashboardContentDetails> {
    return this.httpClient.get<DashboardContentDetails>(url)
  }

  public async getSearchResults(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<DashboardRow> {
    return this.httpClient.get<DashboardRow>(
      `/restapi/tvdashboard/${regionId}/${userId}/contents/search`,
      { params },
    )
  }

  public async getContentActions(url: string): Promise<DashboardContentAction[]> {
    return this.httpClient.get<DashboardContentAction[]>(url)
  }

  public async getContentActionsWithId(
    regionId: string,
    userId: string,
    contentType: string,
    contentId: string,
    profileUid: string,
    params: Record<string, string>,
  ): Promise<DashboardContentAction[]> {
    return this.httpClient.get<DashboardContentAction[]>(
      `/restapi/tvdashboard/${regionId}/${userId}/contents/${contentType}/${contentId}/actions`,
      {
        params,
        headers: { 'X-Profile-Uid': profileUid },
      },
    )
  }

  public async updateFavoriteStatus(
    regionId: string,
    userId: string,
    contentType: string,
    contentId: string,
    profileUid: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.put<void>(
      `/restapi/tvdashboard/${regionId}/${userId}/contents/${contentType}/${contentId}/favorite`,
      null,
      {
        params,
        headers: { 'X-Profile-Uid': profileUid },
      },
    )
  }

  public async updateLikeStatus(
    regionId: string,
    userId: string,
    contentType: string,
    contentId: string,
    profileUid: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.put<void>(
      `/restapi/tvdashboard/${regionId}/${userId}/contents/${contentType}/${contentId}/like`,
      null,
      {
        params,
        headers: { 'X-Profile-Uid': profileUid },
      },
    )
  }

  public async getNextContent(url: string): Promise<DashboardItem> {
    return this.httpClient.get<DashboardItem>(url)
  }

  public async getSimilarContent(url: string): Promise<DashboardRow> {
    return this.httpClient.get<DashboardRow>(url)
  }

  public async getSeriesSeason(
    regionId: string,
    userId: string,
    seriesId: string,
    seasonId: string,
    profileUid: string,
    params: Record<string, string>,
  ): Promise<DashboardRow> {
    return this.httpClient.get<DashboardRow>(
      `/restapi/tvdashboard/${regionId}/${userId}/series/${seriesId}/seasons/${seasonId}`,
      {
        params,
        headers: { 'X-Profile-Uid': profileUid },
      },
    )
  }

  public async getSeriesSeasons(
    regionId: string,
    userId: string,
    seriesId: string,
    profileUid: string,
    params: Record<string, string>,
  ): Promise<DashboardSeriesSeasons> {
    return this.httpClient.get<DashboardSeriesSeasons>(
      `/restapi/tvdashboard/${regionId}/${userId}/series/${seriesId}/seasons`,
      {
        params,
        headers: { 'X-Profile-Uid': profileUid },
      },
    )
  }
}
