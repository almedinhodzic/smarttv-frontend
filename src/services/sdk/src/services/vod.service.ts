import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import {
  VodLibraryInfos,
  VodLibrary,
  VodContent,
  BookmarkListResponse,
  CreateBookmarkParams,
  DeleteBookmarkParams,
  GetVodLibrariesParams,
  VodLibraryInfoDto,
  GraphQLBody,
} from '../models/vod'

export class VodService extends BaseService {
  public async getVodLibraryInfo(
    profileId: string,
    params: Record<string, string>,
  ): Promise<VodLibraryInfos[]> {
    return this.httpClient.post<VodLibraryInfos[]>(
      `${API_ENDPOINTS.VOD}/${profileId}/graphql`,
      null,
      { params },
    )
  }

  public async getVodLibrary(profileId: string, body: GraphQLBody): Promise<VodLibrary> {
    return this.httpClient.post<VodLibrary>(`${API_ENDPOINTS.VOD}/${profileId}/graphql`, body)
  }

  public async getCategory(profileId: string, body: GraphQLBody): Promise<any> {
    return this.httpClient.post<any>(`${API_ENDPOINTS.VOD}/${profileId}/graphql`, body)
  }

  public async getVodForCategories(profileId: string, body: GraphQLBody): Promise<any> {
    return this.httpClient.post<any>(`${API_ENDPOINTS.VOD}/${profileId}/graphql`, body)
  }

  public async getVodContent(profileId: string, body: GraphQLBody): Promise<VodContent> {
    return this.httpClient.post<VodContent>(`${API_ENDPOINTS.VOD}/${profileId}/graphql`, body)
  }

  public async getVodContents(profileId: string, body: GraphQLBody): Promise<VodContent[]> {
    return this.httpClient.post<VodContent[]>(`${API_ENDPOINTS.VOD}/${profileId}/graphql`, body)
  }

  public async getAllBookmarks(regionId: string, userId: string): Promise<BookmarkListResponse> {
    return this.httpClient.get<BookmarkListResponse>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/content/media/bookmarks`,
    )
  }

  public async getBookmarks(
    regionId: string,
    userId: string,
    contentMediaId: string,
  ): Promise<BookmarkListResponse> {
    return this.httpClient.get<BookmarkListResponse>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/content/media/bookmarks/${contentMediaId}`,
    )
  }

  public async createBookmark(
    regionId: string,
    userId: string,
    contentMediaId: string,
    offset: string,
    params: CreateBookmarkParams,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/content/media/bookmarks/${contentMediaId}/${offset}`,
      null,
      { params: params as any },
    )
  }

  public async deleteBookmark(
    regionId: string,
    userId: string,
    contentMediaId: string,
    offset: string,
    params: DeleteBookmarkParams,
  ): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/content/media/bookmarks/${contentMediaId}/${offset}`,
      { params: params as any },
    )
  }

  public async markAsFavorite(url: string, params: { device_uid: string }): Promise<void> {
    return this.httpClient.post<void>(url, null, { params })
  }

  public async unMarkAsFavorite(url: string, params: { device_uid: string }): Promise<void> {
    return this.httpClient.delete<void>(url, { params })
  }

  public async getVodLibraries(
    regionId: string,
    params: GetVodLibrariesParams,
  ): Promise<VodLibraryInfoDto[]> {
    return this.httpClient.get<VodLibraryInfoDto[]>(
      `${API_ENDPOINTS.BS}/${regionId}/store/libraries`,
      { params: params as any },
    )
  }
}
