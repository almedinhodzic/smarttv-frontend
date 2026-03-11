export interface AuthTokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
}

export interface LoginEmailInfo {
  identifier: string
  password: string
  deviceName: string
  deviceId: string
  deviceType: string
}

export interface LoginUsernameInfo {
  identifier: string
  password: string
  deviceName: string
  deviceId: string
  deviceType: string
}

export interface LoginPhoneInfo {
  identifier: string
  password: string
  deviceName: string
  deviceId: string
  deviceType: string
}

export interface LoginMacInfo {
  macAddress: string
  deviceName: string
  deviceId: string
  deviceType: string
}

export interface AuthPinInfo {
  authPin: string
  deviceName: string
  deviceId: string
  deviceType: string
}

export interface RefreshTokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

export interface ResetPasswordDto {
  identifier: string
}

export interface RemoveDeviceDto {
  device_uid: string
}

export interface LoginMethod {
  id: string
  created: string
  updated: string
  type: string
  loginEnabled: boolean
  registrationEnabled: boolean
  oauthId: string
}
