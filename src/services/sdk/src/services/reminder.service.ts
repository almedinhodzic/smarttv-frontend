import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { Reminder } from '../models/advanced'

export class ReminderService extends BaseService {
  public async getReminders(regionId: string, userId: string): Promise<Reminder[]> {
    return this.httpClient.get<Reminder[]>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/live/tv-programs/reminders`,
    )
  }

  public async addReminder(
    regionId: string,
    userId: string,
    programId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/live/tv-programs/reminders/${programId}`,
      null,
      { params },
    )
  }

  public async deleteReminder(
    regionId: string,
    userId: string,
    programId: string,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/live/tv-programs/reminders/${programId}`,
      { params },
    )
  }
}
