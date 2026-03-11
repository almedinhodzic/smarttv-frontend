import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { Program, ProgramApiListResponse, GetProgramsParams } from '../models/content'
import { StringApiListResponse } from '../models/core'

export class EpgService extends BaseService {
  public async getProgram(
    regionId: string,
    programId: string,
    params: Record<string, string>,
  ): Promise<Program> {
    return this.httpClient.get<Program>(
      `${API_ENDPOINTS.BS}/${regionId}/live/tv-programs/${programId}`,
      { params },
    )
  }

  public async getPrograms(
    regionId: string,
    params: GetProgramsParams,
  ): Promise<ProgramApiListResponse> {
    return this.httpClient.get<ProgramApiListResponse>(
      `${API_ENDPOINTS.BS}/${regionId}/live/tv-programs`,
      { params },
    )
  }

  public async getRecommendations(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<ProgramApiListResponse> {
    return this.httpClient.get<ProgramApiListResponse>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/system-recommendations/tv`,
      { params },
    )
  }

  public async getFavoritePrograms(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<StringApiListResponse> {
    return this.httpClient.get<StringApiListResponse>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/live/tv-programs/favourites`,
      { params },
    )
  }

  public async setFavoriteProgram(
    regionId: string,
    userId: string,
    programId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/live/tv-programs/favourites/${programId}`,
      null,
      { params },
    )
  }

  public async deleteFavoriteProgram(
    regionId: string,
    userId: string,
    programId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/live/tv-programs/favourites/${programId}`,
      { params },
    )
  }

  public async isProgramFavorite(
    regionId: string,
    userId: string,
    programId: string,
  ): Promise<void> {
    // Returns 200 if favorite, likely 404 if not.
    return this.httpClient.get<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/live/tv-programs/favourites/${programId}`,
    )
  }
}
