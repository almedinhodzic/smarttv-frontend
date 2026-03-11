import { BaseService } from "./base.service";
import { API_ENDPOINTS } from "../config";
import {
  LoginMethodPhoneInfo,
  PhoneNumberRegistrationInfo,
  LoginMethodEmailInfo,
  LoginMethodSocialInfo,
  PasswordInfo,
  RegistrationInfo,
  UserArrangementResponse,
} from "../models/core";
import { AuthTokenResponse } from "../models/auth";

export class UserInfoService extends BaseService {
  public async alterPhoneLoginMethod(
    info: LoginMethodPhoneInfo,
  ): Promise<RegistrationInfo> {
    return this.httpClient.post<RegistrationInfo>(
      `${API_ENDPOINTS.IDM}/user/login-methods/phone`,
      info,
    );
  }

  public async registerPhoneNumber(
    registrationId: string,
    info: PhoneNumberRegistrationInfo,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.IDM}/user/login-methods/phone/registrations/${registrationId}`,
      info,
    );
  }

  public async confirmEmailLoginMethod(
    confirmationToken: string,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.IDM}/login-methods/email/confirmations/${confirmationToken}`,
    );
  }

  public async alterEmailLoginMethod(
    info: LoginMethodEmailInfo,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.IDM}/user/login-methods/email`,
      info,
    );
  }

  public async alterGoogleLoginMethod(
    info: LoginMethodSocialInfo,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.IDM}/user/login-methods/google`,
      info,
    );
  }

  public async alterFacebookLoginMethod(
    info: LoginMethodSocialInfo,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.IDM}/user/login-methods/facebook`,
      info,
    );
  }

  public async alterAppleLoginMethod(
    info: LoginMethodSocialInfo,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.IDM}/user/login-methods/apple`,
      info,
    );
  }

  public async alterPassword(info: PasswordInfo): Promise<AuthTokenResponse> {
    return this.httpClient.post<AuthTokenResponse>(
      `${API_ENDPOINTS.IDM}/user/password`,
      info,
    );
  }

  public async getAuthenticatedUserArrangement(): Promise<UserArrangementResponse> {
    return this.httpClient.get<UserArrangementResponse>(
      `${API_ENDPOINTS.IDM}/user`,
    );
  }
}
