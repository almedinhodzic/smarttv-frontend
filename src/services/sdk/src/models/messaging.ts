export interface MessageInfo {
  ids: string[];
}

export interface ServerMessagesResponse {
  messages: any[];
}

export interface ServerMessagesStatus {
  unreadCount: number;
}

export interface ApplicationInfoDto {
  appId: string;
  version: string;
}

export interface PushNotificationsDeviceInfoDto {
  token: string;
  platform: string;
}

export interface PushNotificationsPushMsgInfoDto {
  pushToken: string;
}
