export interface RegisterEmailInfoDto {
  email: string;
  // other fields
}

export interface RegisterPhoneInfoDto {
  phoneNumber: string;
  // other fields
}

export interface RegisterFacebookInfoDto {
  token: string;
}

export interface RegisterGoogleInfoDto {
  token: string;
}

export interface RegisterAppleIdInfoDto {
  token: string;
}

export interface RegisterEmailConfirmationInfoDto {
  // fields
}

export interface RegisterPhoneConfirmationInfoDto {
  otp: string;
}
