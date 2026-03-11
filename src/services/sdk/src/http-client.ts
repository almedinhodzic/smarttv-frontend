import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { SdkConfig } from './config'

export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(config: SdkConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      headers: {
        Accept: "application/vnd.beenius+json",
        "Content-Type": "application/vnd.beenius+json",
      },
    });
  }

  public setAuthToken(token: string) {
    this.axiosInstance.defaults.headers.common["Authorization"] =
      `Bearer ${token}`;
  }

  public clearAuthToken() {
    delete this.axiosInstance.defaults.headers.common["Authorization"];
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(
      url,
      config,
    );
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(
      url,
      data,
      config,
    );
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(
      url,
      data,
      config,
    );
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(
      url,
      config,
    );
    return response.data;
  }

  public async postJson<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(
      url,
      data,
      {
        ...(config ?? {}),
        headers: {
          Accept: "application/vnd.beenius+json",
          "Content-Type": "application/json",
          ...(config?.headers ?? {}),
        },
      },
    );
    return response.data;
  }
}
