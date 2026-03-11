export enum ChannelCategoryType {
  FAVORITES = "FAVORITES",
  ALL = "ALL",
  STANDARD = "STANDARD",
  MOSAIC = "MOSAIC",
}

export interface ChannelCategory {
  id: string;
  name: string;
  parentId?: string | null;
  reorderable: boolean;
  resizable: boolean;
  channelIds: string[];
  leaf: boolean;
  kidsCategory: boolean;
  type: ChannelCategoryType;
}

export interface UserChannelCategory {
  id: string;
  name: string;
  channelIds?: string[] | null;
}

export interface MediaResource {
  contentStreamUid?: string;
  customMetadata?: Record<string, any>;
  dialect?: string;
  drmProtection: boolean;
  duration: number;
  fccSsrc?: any;
  liveCBuffer?: {
    cbSize: number | null;
    rtspSpeed: number | null;
    rtspUrl: string | null;
  };
  location?: string | null;
  oTag?: string | null;
  offset: number;
  other?: string | null;
  profiles: string;
  protocol?: string;
  protocolStack: string;
  provider?: string;
  signOauth: boolean;
  src: string;
  srcTemplate?: any;
  capabilities?: string | null;
}

export interface Channel {
  id: number;
  uid: string;
  name: string;
  number: number;
  type: string;
  hd: boolean;
  quality: string;
  icon: string | null;
  poster: string | null;
  streams: MediaResource[];
  pipStreams: MediaResource[];
  circularBufferStreams: MediaResource[];
  timeshift: boolean;
  pauseAndResume: boolean;
  instantRecordable: boolean;
  localRecordable: boolean;
  programRecordable: boolean;
  ageRating: number;
  voidEpgPopup: boolean;
  broadcasting: boolean;
  previewDuration: number;
  activated?: number | null;
  deactivated?: number | null;
}

export interface ChannelApiListResponse {
  list: Channel[];
  nextPageLink?: string;
  pageNumber: number;
  pageSize: number;
  rowCount: number;
}
