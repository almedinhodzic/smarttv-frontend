import { MediaResource } from "./vod";

export type ContentLikeStatus = "none" | "like" | "dislike";

export type ContentActionType =
  | "play"
  | "resume-play"
  | "watch"
  | "buy"
  | "trailer"
  | "details"
  | "adopt-recording"
  | "delete-recording"
  | "favorite"
  | "unfavorite"
  | "like"
  | "dislike"
  | "next"
  | "similar";

export interface SubscriptionInfoHolder {
  subscriptionId: string;
  title: string;
}

export interface ProductInfoHolder {
  productId: string;
  title: string;
}

export interface DtoPrice {
  currency: string;
  value: number;
}

export interface DashboardContentAction {
  type: ContentActionType;
  mrs?: any; // Media Resource Service object?
  recordingId?: string | number;
  isUserRecording?: boolean;
  start?: number;
  end?: number;
  offset?: number;
  detailsLink?: string;
  status?: ContentLikeStatus;
  channelId?: number;
  minPrice?: DtoPrice;
  maxPrice?: DtoPrice;
  subscriptions?: SubscriptionInfoHolder[];
  products?: ProductInfoHolder[];
  showId?: string | number;
  similarLink?: string;
  nextContentLink?: string;
}

export interface DashboardContentDetails {
  description: string;
  directors: string[];
  cast: string[];
  writers: string[];
  audios: string[];
  subtitles: string[];
  quality: string[];
  isThreeD: boolean;
}

// Re-export existing dashboard models that were good
export interface DashboardRows {
  rows: DashboardRow[];
  nextEpisodeIdToWatch?: string;
  position?: { rowIndex: number; itemIndex: number }; // from fetchRows analysis
}

export interface DashboardRow {
  id?: string;
  title: string;
  type: string; // 'settings', 'search', etc.
  list: DashboardItem[];
  nextPageLink?: string | null;
  previousPageLink?: string | null;
  currentPageLink?: string | null;
}

export interface DashboardItem {
  id: string;
  title: string;
  image?: string; // from dashboard service "image"
  poster?: string;
  target?: string;
  type?: string;
  // Add specific fields if needed
  [key: string]: any;
}

export interface DashboardRecommendationProfile {
  profileUid: string;
  name: string;
  isFirstUse?: boolean;
  isRecommendationPersonalized?: boolean;
  isDashboardDefaultScreen?: boolean;
  shouldSendData?: boolean;
  shouldExplainRecommendation?: boolean;
}

export interface DashboardSeriesSeasons {
  seasons: any[];
}

export interface Advertisement {
  id: string;
  contentUrl: string;
  trackingUrl: string;
}

export interface ConsentLoginResponse {
  subscriberId: string;
  consentRequired: boolean;
}

export interface ConsentTemplate {
  id: string;
  text: string;
  version: string;
}

export interface SubscriberConsentUpdate {
  consentId: string;
  granted: boolean;
}
