export interface PurchasedProduct {
  productId: string;
  transactionId: string;
  purchaseDate: number;
  // details
}

export interface Toc {
  id: string;
  version: string;
  text: string;
  mandatory: boolean;
}

export interface TocUpdateDto {
  id: string;
  accepted: boolean;
}

export interface GeoRestriction {
  blocked: boolean;
  reason?: string;
}
