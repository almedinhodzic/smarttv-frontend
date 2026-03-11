import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { Recording, RecordingSet, SeriesRecording, Quota } from '../models/advanced'

export class RecordingService extends BaseService {
  public async getRecordings(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<any> {
    return this.httpClient.get(`${API_ENDPOINTS.BS}/${regionId}/${userId}/recordings`, { params })
  }

  public async startRecording(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<RecordingSet> {
    return this.httpClient.post<RecordingSet>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/recordings`,
      null,
      { params },
    )
  }

  public async deleteRecording(
    regionId: string,
    userId: string,
    recordingId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/recordings/id-${recordingId}`,
      { params },
    )
  }

  public async getSeriesRecordings(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<any> {
    return this.httpClient.get(`${API_ENDPOINTS.BS}/${regionId}/${userId}/recordings/series`, {
      params,
    })
  }

  public async startSeriesRecording(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<SeriesRecording> {
    return this.httpClient.post<SeriesRecording>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/recordings/series`,
      null,
      { params },
    )
  }

  public async cancelSeries(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/recordings/series`,
      { params },
    )
  }

  public async adoptEpisode(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<Recording> {
    return this.httpClient.post<Recording>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/recordings/series/adopt-episode`,
      null,
      { params },
    )
  }

  public async getQuota(regionId: string, userId: string): Promise<Quota> {
    return this.httpClient.get<Quota>(`${API_ENDPOINTS.BS}/${regionId}/${userId}/recordings/quota`)
  }

  public async getRecordingsFromLink(url: string): Promise<any> {
    return this.httpClient.get(url)
  }

  public async getAllBookmarks(regionId: string, userId: string): Promise<any> {
    return this.httpClient.get(`${API_ENDPOINTS.BS}/${regionId}/${userId}/recordings/bookmarks`)
  }

  public async getBookmarks(regionId: string, userId: string, recordingId: string): Promise<any> {
    return this.httpClient.get(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/recordings/bookmarks/${recordingId}`,
    )
  }

  public async createBookmark(
    regionId: string,
    userId: string,
    recordingId: string,
    offset: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/recordings/bookmarks/${recordingId}/${offset}`,
      null,
      { params },
    )
  }

  public async deleteBookmark(
    regionId: string,
    userId: string,
    recordingId: string,
    offset: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/recordings/bookmarks/${recordingId}/${offset}`,
      { params },
    )
  }
}
