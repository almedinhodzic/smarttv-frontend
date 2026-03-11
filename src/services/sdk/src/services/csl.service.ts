import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { SessionInfo, SessionContentInfo, ActiveSessionsInfo, SessionTTL } from '../models/advanced'

export class ConcurrentStreamLimitationService extends BaseService {
  public async createSession(subscriberId: string, sessionInfo: SessionInfo): Promise<SessionInfo> {
    return this.httpClient.post<SessionInfo>(
      `${API_ENDPOINTS.CSL}/${subscriberId}/sessions`,
      sessionInfo,
    )
  }

  public async updateSession(
    subscriberId: string,
    sessionId: string,
    sessionContentInfo: SessionContentInfo,
  ): Promise<void> {
    return this.httpClient.put<void>(
      `${API_ENDPOINTS.CSL}/${subscriberId}/sessions/${sessionId}`,
      sessionContentInfo,
    )
  }

  public async revokeSession(subscriberId: string, sessionId: string): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.CSL}/${subscriberId}/sessions/${sessionId}`,
    )
  }

  public async getSession(subscriberId: string, sessionId: string): Promise<SessionInfo> {
    return this.httpClient.get<SessionInfo>(
      `${API_ENDPOINTS.CSL}/${subscriberId}/sessions/${sessionId}`,
    )
  }

  public async getActiveSessions(subscriberId: string): Promise<ActiveSessionsInfo> {
    return this.httpClient.get<ActiveSessionsInfo>(
      `${API_ENDPOINTS.CSL}/${subscriberId}/sessions/active`,
    )
  }

  public async keepSessionAlive(subscriberId: string, sessionId: string): Promise<void> {
    return this.httpClient['axiosInstance'].patch(
      `${API_ENDPOINTS.CSL}/${subscriberId}/sessions/${sessionId}`,
    )
  }

  public async getSessionTTLInSeconds(): Promise<SessionTTL> {
    return this.httpClient.get<SessionTTL>(`${API_ENDPOINTS.CSL}/sessions/ttl`)
  }
}
