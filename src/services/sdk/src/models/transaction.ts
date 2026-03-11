export interface PaymentBalanceResponse {
  amount: number;
  currency: string;
}

export interface PaymentBalanceInfo {
  pin: string;
}

export interface PaymentCardTopUpInfo {
  amount: number;
  currency: string;
  cardToken: string;
}

export enum PaymentOptionType {
  CREDIT_CARD = "credit_card",
  PAYPAL = "paypal",
  MOBILE = "mobile",
}

export interface PaymentRequestInfo {
  // fields for payment
}

export interface PaymentMobileSmsRequestInfo {
  pin: string;
}

export interface PaymentStatusResponse {
  status: string;
}

export interface PaymentDiscountResponse {
  discount: number;
  finalPrice: number;
}

export interface PaymentOptionsInfo {
  // fields
}

export interface PaymentOptionsResponse {
  options: any[];
}

export interface PaymentSubscriptionResponse {
  // fields
}

export interface DefaultPaymentOption {
  id: string;
  type: string;
}

export interface DefaultPaymentOptionInfo {
  id: string;
}

export interface PaymentCardResponse {
  token: string;
  last4: string;
  brand: string;
}

export interface PaymentAddCardRequestInfo {
  // fields
}

export interface PaymentAddCardResponse {
  token: string;
  actionId?: string;
}

export interface PaymentCardActionResponse {
  status: string;
}

export interface PaymentVatResponse {
  vatrate: number;
}

export interface PaymentFeedbackRequestInfo {
  message: string;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
}

export interface ActiveSubscription {
  id: string;
  subscriptionId: string;
  status: string;
  expiryDate: number;
}

export interface SubscriptionGroup {
  id: string;
  name: string;
  description: string;
  subscriptions: Subscription[];
}
