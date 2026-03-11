import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import {
  LoginEmailInfo,
  LoginUsernameInfo,
  LoginPhoneInfo,
  LoginMacInfo,
  AuthTokenResponse,
  RefreshTokenResponse,
  ResetPasswordDto,
  RemoveDeviceDto,
  AuthPinInfo,
  LoginMethod,
} from '../models/auth'

export class AuthService extends BaseService {
  public async authenticateEmail(
    info: LoginEmailInfo,
  ): Promise<AuthTokenResponse> {
    return this.httpClient.post<AuthTokenResponse>(
      `${API_ENDPOINTS.IDM}/login/email`,
      info,
    );
  }

  public async authenticateUsername(
    info: LoginUsernameInfo,
  ): Promise<AuthTokenResponse> {
    return this.httpClient.post<AuthTokenResponse>(
      `${API_ENDPOINTS.IDM}/login/username`,
      info,
    );
  }

  public async authenticatePhone(
    info: LoginPhoneInfo,
  ): Promise<AuthTokenResponse> {
    return this.httpClient.post<AuthTokenResponse>(
      `${API_ENDPOINTS.IDM}/login/phone`,
      info,
    );
  }

  public async authenticateAuthPin(
    info: AuthPinInfo,
  ): Promise<AuthTokenResponse> {
    return this.httpClient.postJson<AuthTokenResponse>(
      `${API_ENDPOINTS.IDM}/login/auth-pin`,
      info,
    );
  }

  public async authenticateMac(info: LoginMacInfo): Promise<AuthTokenResponse> {
    return this.httpClient.post<AuthTokenResponse>(
      `${API_ENDPOINTS.IDM}/login/mac`,
      info,
    );
  }

  public async getLoginMethods(): Promise<LoginMethod[]> {
    return this.httpClient.get<LoginMethod[]>(
      `${API_ENDPOINTS.IDM}/login-methods`,
    );
  }

  public async refreshToken(
    refreshToken: string,
    clientId: string = "public-client",
  ): Promise<RefreshTokenResponse> {
    // Note: This endpoint is form-url-encoded in Kotlin implementation
    const params = new URLSearchParams();
    params.append("refresh_token", refreshToken);
    params.append("grant_type", "refresh_token");
    params.append("client_id", clientId);

    return this.httpClient.post<RefreshTokenResponse>(`/oauth2/token`, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  }

  public async deauthenticate(): Promise<void> {
    return this.httpClient.post<void>(`${API_ENDPOINTS.IDM}/logout`);
  }

  public async resetPassword(data: ResetPasswordDto): Promise<any> {
    return this.httpClient.post(`${API_ENDPOINTS.IDM}/password`, data);
  }

  public async removeDevice(data: RemoveDeviceDto): Promise<void> {
    // Axios delete accepts config as second argument, containing 'data'
    return this.httpClient.delete<void>(`${API_ENDPOINTS.IDM}/devices`, {
      data,
    });
  }
}
