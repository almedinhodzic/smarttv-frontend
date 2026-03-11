import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { Series, Episode, Season, PaginatedResponse, SeriesListResponse } from '../models/content'
import { Media } from '../models/vod'

export class SeriesService extends BaseService {
  public async getSeries(
    regionId: string,
    params: Record<string, string>,
  ): Promise<SeriesListResponse<Series>> {
    return this.httpClient.get<SeriesListResponse<Series>>(
      `${API_ENDPOINTS.BS}/${regionId}/series`,
      {
        params,
      },
    )
  }

  public async getSeriesById(
    regionId: string,
    seriesId: string,
    params: Record<string, string>,
  ): Promise<Series> {
    return this.httpClient.get<Series>(`${API_ENDPOINTS.BS}/${regionId}/series/${seriesId}`, {
      params,
    })
  }

  public async getEpisode(regionId: string, episodeId: string): Promise<Episode> {
    return this.httpClient.get<Episode>(
      `${API_ENDPOINTS.BS}/${regionId}/series/episodes/${episodeId}`,
    )
  }

  public async getSeason(
    regionId: string,
    seasonId: string,
    params: Record<string, string>,
  ): Promise<Season> {
    return this.httpClient.get<Season>(
      `${API_ENDPOINTS.BS}/${regionId}/series/seasons/${seasonId}`,
      { params },
    )
  }

  public async getSeasons(
    regionId: string,
    seriesId: string,
    params: Record<string, string>,
  ): Promise<SeriesListResponse<Season>> {
    return this.httpClient.get<SeriesListResponse<Season>>(
      `${API_ENDPOINTS.BS}/${regionId}/series/${seriesId}/seasons`,
      {
        params,
      },
    )
  }

  public async getFavorites(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<SeriesListResponse<Series>> {
    return this.httpClient.get<SeriesListResponse<Series>>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/series/favourites`,
      {
        params,
      },
    )
  }

  public async getNextEpisode(regionId: string, episodeId: string): Promise<Episode> {
    return this.httpClient.get<Episode>(
      `${API_ENDPOINTS.BS}/${regionId}/series/episodes/${episodeId}/next`,
    )
  }

  public async getEpisodes(
    regionId: string,
    seasonId: string,
    params: Record<string, string>,
  ): Promise<SeriesListResponse<Episode>> {
    return this.httpClient.get<SeriesListResponse<Episode>>(
      `${API_ENDPOINTS.BS}/${regionId}/series/seasons/${seasonId}/episodes`,
      { params },
    )
  }

  public async getFirstEpisode(regionId: string, seriesId: string): Promise<Episode> {
    return this.httpClient.get<Episode>(
      `${API_ENDPOINTS.BS}/${regionId}/series/${seriesId}/episodes/first`,
    )
  }

  public async isSeriesFavorite(regionId: string, userId: string, seriesId: string): Promise<void> {
    return this.httpClient.get<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/series/favourites/${seriesId}`,
    )
  }

  public async getFavoriteSeasons(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<SeriesListResponse<Season>> {
    return this.httpClient.get<SeriesListResponse<Season>>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/series/seasons/favourites`,
      { params },
    )
  }

  public async isSeasonFavorite(regionId: string, userId: string, seasonId: string): Promise<void> {
    return this.httpClient.get<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/series/seasons/favourites/${seasonId}`,
    )
  }

  public async saveSeriesAsFavorite(
    regionId: string,
    userId: string,
    seriesId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/series/favourites/${seriesId}`,
      null,
      { params },
    )
  }

  public async saveSeasonAsFavorite(
    regionId: string,
    userId: string,
    seasonId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/series/seasons/favourites/${seasonId}`,
      null,
      { params },
    )
  }

  public async removeFromFavorites(
    regionId: string,
    userId: string,
    seriesId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/series/favourites/${seriesId}`,
      { params },
    )
  }

  public async removeFavoriteSeason(
    regionId: string,
    userId: string,
    seasonId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/series/seasons/favourites/${seasonId}`,
      { params },
    )
  }

  public async getMedia(
    regionId: string,
    params: Record<string, string>,
  ): Promise<PaginatedResponse<Media>> {
    // Hardcoded path from Kotlin definition
    return this.httpClient.get<PaginatedResponse<Media>>(
      `/restapi/rest/${regionId}/content/media`,
      { params },
    )
  }
}
