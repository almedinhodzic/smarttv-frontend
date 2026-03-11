import { BaseService } from './base.service'
import { API_ENDPOINTS } from '../config'
import {
  PaymentBalanceResponse,
  PaymentBalanceInfo,
  PaymentCardTopUpInfo,
  PaymentOptionType,
  PaymentRequestInfo,
  PaymentMobileSmsRequestInfo,
  PaymentStatusResponse,
  PaymentDiscountResponse,
  PaymentOptionsInfo,
  PaymentOptionsResponse,
  PaymentSubscriptionResponse,
  DefaultPaymentOption,
  DefaultPaymentOptionInfo,
  PaymentCardResponse,
  PaymentAddCardRequestInfo,
  PaymentAddCardResponse,
  PaymentCardActionResponse,
  PaymentVatResponse,
  PaymentFeedbackRequestInfo,
} from '../models/transaction'

export class PaymentService extends BaseService {
  public async getBalance(params: Record<string, string>): Promise<PaymentBalanceResponse> {
    return this.httpClient.get<PaymentBalanceResponse>(`${API_ENDPOINTS.PAYMENT}/balance`, {
      params,
    })
  }

  public async topUpWithScratchCard(
    paymentBalanceInfo: PaymentBalanceInfo,
    params: Record<string, string>,
  ): Promise<PaymentBalanceResponse> {
    return this.httpClient.post<PaymentBalanceResponse>(
      `${API_ENDPOINTS.PAYMENT}/balance/token`,
      paymentBalanceInfo,
      { params },
    )
  }

  public async topUpWalletWithCard(
    requestInfo: PaymentCardTopUpInfo,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.post<void>(`${API_ENDPOINTS.PAYMENT}/balance/card`, requestInfo, {
      params,
    })
  }

  public async payWithPayload(
    paymentId: string,
    method: PaymentOptionType,
    payload: PaymentRequestInfo,
  ): Promise<any> {
    return this.httpClient.post<any>(
      `${API_ENDPOINTS.PAYMENT}/payments/${paymentId}/${method}`,
      payload,
    )
  }

  public async pay(paymentId: string, method: PaymentOptionType): Promise<any> {
    return this.httpClient.post<any>(`${API_ENDPOINTS.PAYMENT}/payments/${paymentId}/${method}`)
  }

  public async confirmMobilePin(
    paymentId: string,
    payload: PaymentMobileSmsRequestInfo,
  ): Promise<any> {
    return this.httpClient.post<any>(
      `${API_ENDPOINTS.PAYMENT}/payments/${paymentId}/mobile/pin`,
      payload,
    )
  }

  public async resendMobilePin(paymentId: string): Promise<any> {
    return this.httpClient.post<any>(
      `${API_ENDPOINTS.PAYMENT}/payments/${paymentId}/mobile/pin/resend`,
    )
  }

  public async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    return this.httpClient.get<PaymentStatusResponse>(
      `${API_ENDPOINTS.PAYMENT}/payments/${paymentId}/status`,
    )
  }

  public async getContentDiscount(
    contentId: string,
    params: Record<string, any>,
  ): Promise<PaymentDiscountResponse> {
    return this.httpClient.get<PaymentDiscountResponse>(
      `${API_ENDPOINTS.PAYMENT}/contents/${contentId}/discount`,
      { params },
    )
  }

  public async getPaymentOptions(
    paymentOptionsInfo: PaymentOptionsInfo,
    params: Record<string, string>,
  ): Promise<PaymentOptionsResponse> {
    return this.httpClient.post<PaymentOptionsResponse>(
      `${API_ENDPOINTS.PAYMENT}/payment-options`,
      paymentOptionsInfo,
      { params },
    )
  }

  public async getSubscription(
    params: Record<string, string>,
  ): Promise<PaymentSubscriptionResponse> {
    return this.httpClient.get<PaymentSubscriptionResponse>(
      `${API_ENDPOINTS.PAYMENT}/user/subscription`,
      { params },
    )
  }

  public async cancelSubscription(params: Record<string, string>): Promise<void> {
    return this.httpClient.delete<void>(`${API_ENDPOINTS.PAYMENT}/user/subscription`, { params })
  }

  public async getDefaultPaymentOptions(
    params: Record<string, string>,
  ): Promise<DefaultPaymentOption[]> {
    return this.httpClient.get<DefaultPaymentOption[]>(
      `${API_ENDPOINTS.PAYMENT}/user/payment-options/default`,
      { params },
    )
  }

  public async postDefaultPaymentOption(
    defaultPaymentOptionInfo: DefaultPaymentOptionInfo,
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.post<void>(
      `${API_ENDPOINTS.PAYMENT}/user/payment-options/default`,
      defaultPaymentOptionInfo,
      { params },
    )
  }

  public async removeSubscriptionDefaultPaymentOption(
    params: Record<string, string>,
  ): Promise<void> {
    return this.httpClient.delete<void>(
      `${API_ENDPOINTS.PAYMENT}/user/payment-options/default/subscription`,
      { params },
    )
  }

  public async getCards(params: Record<string, string>): Promise<PaymentCardResponse[]> {
    return this.httpClient.get<PaymentCardResponse[]>(`${API_ENDPOINTS.PAYMENT}/user/cards`, {
      params,
    })
  }

  public async postCard(
    defaultPaymentOptionInfo: PaymentAddCardRequestInfo,
    params: Record<string, string>,
  ): Promise<PaymentAddCardResponse> {
    return this.httpClient.post<PaymentAddCardResponse>(
      `${API_ENDPOINTS.PAYMENT}/user/cards`,
      defaultPaymentOptionInfo,
      { params },
    )
  }

  public async getCardActionStatus(actionId: string): Promise<PaymentCardActionResponse> {
    return this.httpClient.get<PaymentCardActionResponse>(
      `${API_ENDPOINTS.PAYMENT}/card-actions/${actionId}/status`,
    )
  }

  public async deleteCard(token: string, params: Record<string, string>): Promise<void> {
    return this.httpClient.delete<void>(`${API_ENDPOINTS.PAYMENT}/user/cards/${token}`, { params })
  }

  public async getVats(params: Record<string, string>): Promise<PaymentVatResponse[]> {
    return this.httpClient.get<PaymentVatResponse[]>(`${API_ENDPOINTS.PAYMENT}/user/vat`, {
      params,
    })
  }

  public async sendFeedback(
    requestInfo: PaymentFeedbackRequestInfo,
    params: Record<string, string>,
  ): Promise<any> {
    return this.httpClient.post<any>(`${API_ENDPOINTS.PAYMENT}/user/feedback`, requestInfo, {
      params,
    })
  }
}
