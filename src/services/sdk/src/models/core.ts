export interface SystemInfo {
  version: string
  serverTime: number
  // Add other fields as discovered from usage or validation
}

export interface LanguageInfo {
  isoCode: string
  name: string
}

export interface User {
  id: string
  name: string
  // Add other fields from User serialization
}

export interface UserDevice {
  id: string
  name: string
  type: string
  // Add other fields from UserDevice serialization
}

export interface DeleteDeviceInfo {
  device_uid: string
}

export interface LoginMethodPhoneInfo {
  phoneNumber: string
  // add other fields
}

export interface PhoneNumberRegistrationInfo {
  otp: string
}

export interface LoginMethodEmailInfo {
  email: string
  // add other fields
}

export interface LoginMethodSocialInfo {
  token: string
}

export interface PasswordInfo {
  currentPassword?: string
  newPassword?: string
}

export interface RegistrationInfo {
  registrationId: string
  ttl: number
}

export interface UserArrangementResponse {
  // Define structure based on usage
}

export interface StringApiListResponse {
  items: string[]
}

export interface GetUserProfilesParams {
  page_size?: string
}

export interface AddUserParams {
  name: string
  device_uid: string
  return_security_token?: string
  age_rating?: string
  system_pin?: string
}

export interface SaveUserInfoParams {
  name?: string
  gender?: 'M' | 'F'
  age_rating?: string
  auto_sub?: string
  auto_audio?: string
  auto_reminder_time?: string
  tv_recommend?: string
  vod_recommend?: string
  id_avatar?: string
  device_uid: string
  language?: string
  birth_date?: string
  id_channel?: string
  id_channel_category?: string
  phone_num?: string
  p_message?: string
  address?: string
  nickname?: string
  email?: string
  system_pin?: string
  pin_type?: 'system' | 'parental'
}

export interface DeleteUserParams {
  device_uid: string
}
