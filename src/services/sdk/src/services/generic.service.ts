import { BaseService } from './base.service'

export class GenericService extends BaseService {
  public async get(
    url: string,
    params: Record<string, string>,
    headers: Record<string, string>,
  ): Promise<any> {
    return this.httpClient.get(url, { params, headers })
  }

  public async post(
    url: string,
    body: any,
    params: Record<string, string>,
    headers: Record<string, string>,
  ): Promise<any> {
    return this.httpClient.post(url, body, { params, headers })
  }

  // Note: Overloaded post for form-url-encoded in Kotlin
  public async postForm(
    url: string,
    formBody: Record<string, string>,
    params: Record<string, string>,
    headers: Record<string, string>,
  ): Promise<any> {
    const urlParams = new URLSearchParams()
    for (const key in formBody) {
      urlParams.append(key, formBody[key])
    }
    return this.httpClient.post(url, urlParams, {
      params,
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  public async put(
    url: string,
    body: any,
    params: Record<string, string>,
    headers: Record<string, string>,
  ): Promise<any> {
    return this.httpClient.put(url, body, { params, headers })
  }

  public async delete(
    url: string,
    params: Record<string, string>,
    headers: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.delete(url, { params, headers })
  }
}
