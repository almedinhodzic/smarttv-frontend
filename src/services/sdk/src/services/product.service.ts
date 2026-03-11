import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { PurchasedProduct } from '../models/misc'

export class ProductService extends BaseService {
  public async getProducts(regionId: string, params: Record<string, string>): Promise<any> {
    return this.httpClient.get(`${API_ENDPOINTS.BS}/${regionId}/store/products`, { params })
  }

  public async getPurchasedProducts(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<any> {
    return this.httpClient.get(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/store/purchased-products`,
      { params },
    )
  }

  public async purchaseProduct(
    regionId: string,
    userId: string,
    params: Record<string, string>,
  ): Promise<PurchasedProduct> {
    return this.httpClient.put<PurchasedProduct>(
      `${API_ENDPOINTS.BS}/${regionId}/${userId}/store/purchased-products`,
      null,
      { params },
    )
  }
}
