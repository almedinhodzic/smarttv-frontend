import { BaseService } from "./base.service";
import { API_ENDPOINTS } from "../config";
import {
  RegisterEmailInfoDto,
  RegisterPhoneInfoDto,
  RegisterFacebookInfoDto,
  RegisterGoogleInfoDto,
  RegisterAppleIdInfoDto,
  RegisterEmailConfirmationInfoDto,
  RegisterPhoneConfirmationInfoDto,
} from "../models/registration";
import { RegistrationInfo } from "../models/core";
import { AuthTokenResponse } from "../models/auth";

export class RegistrationService extends BaseService {
  public async registerEmail(
    info: RegisterEmailInfoDto,
  ): Promise<RegistrationInfo> {
    return this.httpClient.post<RegistrationInfo>(
      `${API_ENDPOINTS.IDM}/email/registrations`,
      info,
    );
  }

  public async registerPhone(
    info: RegisterPhoneInfoDto,
  ): Promise<RegistrationInfo> {
    return this.httpClient.post<RegistrationInfo>(
      `${API_ENDPOINTS.IDM}/phone/registrations`,
      info,
    );
  }

  public async registerFacebook(
    info: RegisterFacebookInfoDto,
  ): Promise<AuthTokenResponse> {
    return this.httpClient.post<AuthTokenResponse>(
      `${API_ENDPOINTS.IDM}/facebook/registrations`,
      info,
    );
  }

  public async registerGoogle(
    info: RegisterGoogleInfoDto,
  ): Promise<AuthTokenResponse> {
    return this.httpClient.post<AuthTokenResponse>(
      `${API_ENDPOINTS.IDM}/google/registrations`,
      info,
    );
  }

  public async registerAppleId(
    info: RegisterAppleIdInfoDto,
  ): Promise<AuthTokenResponse> {
    return this.httpClient.post<AuthTokenResponse>(
      `${API_ENDPOINTS.IDM}/apple/registrations`,
      info,
    );
  }

  public async confirmEmail(
    confirmationToken: string,
    info: RegisterEmailConfirmationInfoDto,
  ): Promise<AuthTokenResponse> {
    return this.httpClient.post<AuthTokenResponse>(
      `${API_ENDPOINTS.IDM}/email/registrations/confirmations/${confirmationToken}/login`,
      info,
    );
  }

  public async confirmPhoneNumber(
    registrationId: string,
    info: RegisterPhoneConfirmationInfoDto,
  ): Promise<AuthTokenResponse> {
    return this.httpClient.post<AuthTokenResponse>(
      `${API_ENDPOINTS.IDM}/phone/registrations/${registrationId}/confirmation`,
      info,
    );
  }
}
