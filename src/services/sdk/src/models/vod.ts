export enum PurchaseStatus {
  FREE = 'FREE',
  PURCHASED = 'PURCHASED',
  PAYABLE = 'PAYABLE',
  CALL_OPERATOR = 'CALL_OPERATOR',
  PRE_ORDER = 'PRE_ORDER',
  PRE_ORDERED = 'PRE_ORDERED',
  IN_OTHER_SUBSCRIPTION = 'IN_OTHER_SUBSCRIPTION',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum ContentType {
  VIDEO = 'video',
  EPISODE = 'episode',
  VIDEO_COLLECTION = 'video_collection',
  SERIES = 'series',
  SEASON = 'season',
  MOVIE = 'movie', // from dashboard service analysis
  SHOW = 'show', // from dashboard service analysis
}

export enum BillingType {
  PERIODIC = 'periodic',
  ONE_TIME = 'one-time',
}

export enum RentalPeriodUnit {
  FIXED = 'fixed',
  MONTH = 'month',
  DAY = 'day',
  HOUR = 'hour',
}

export interface Poster {
  landscape: string
  portrait: string
}

export interface LibrarySubscription {
  uid: string
  isPurchased: boolean
}

export interface VodLibrary {
  id: string
  title: string
  description?: string
  poster: Poster
  librarySubscriptions: LibrarySubscription[]
  categories?: Category[]
}

export interface VodLibraryInfos {
  id: string
  title: string
}

export interface ContentPreview {
  categoryId: number
  poster: Poster
  ageRating: number
}

export interface ContentConnection {
  subCategoriesContentCount: number
  contentCount: number
  contents: ContentPreview[]
}

export interface Category {
  id: string
  title: string
  tag: string
  poster: Poster
  ageRating: string
  isLeaf: string // "true" or "false" string in GQL sometimes? Or boolean. JSDoc says string.
  contentConnection: ContentConnection
  subcategories?: Category[]
}

export interface Price {
  currency: string
  currencySymbol: string
  value: number
  billingType: BillingType
  rentalPeriodUnit: RentalPeriodUnit
  rentalPeriodValue: number
}

export interface PriceInfo {
  minPrice: Price
  maxPrice: Price
  minPayPoints: Price
  maxPayPoints: Price
}

export interface ContentPurchaseInfo {
  validTill: number
  status: PurchaseStatus
  priceInfo: PriceInfo
  libraryId: string
}

export interface MediaResource {
  contentStreamUid: string
  src: string
  profiles: string
  protocolStack: string
  signOauth: boolean
  duration: number
  offset: number
  capabilities: number
  oTag: number
  drmProtection: boolean
}

export interface PlayAction {
  mediaId: string // Note: JSDoc said Price, but that looks like a typo, context implies ID. But let's check carefully.
  // Actually JSDoc said `@property {Price} mediaId`, this is likely a copy-paste error in JSDoc.
  // Usually mediaId is string.
  mediaResources: MediaResource[]
}

export interface ResumePlayAction {
  mediaId: string
  subtitle: string
  audio: string
  created: number
  offset: number
}

export interface BuyAction {
  mediaId: string
  products: ProductInfo[]
  subscriptions: SubscriptionInfo[]
}

export interface PreOrderedAction {
  mediaId: string
  consumptionPeriod: Period[]
}

export interface CurrentEpisodeInfo {
  play: PlayAction[]
  resumePlay: ResumePlayAction[]
  seasonId: string
  seasonNumber: number
  episodeId: string
  episodeNumber: number
}

export interface ContentActions {
  play: PlayAction[]
  resumePlay: ResumePlayAction[]
  trailer: PlayAction[]
  buy: BuyAction[]
  preOrdered: PreOrderedAction[]
  favorite: string[] // ids?
  unfavorite: string[]
  deleteAutoBookmark: string[]
  share: string[]
  currentEpisode: CurrentEpisodeInfo
}

export interface Period {
  from: number
  to: number
}

export interface PurchaseItem {
  id: string
  type: string // 'on-demand-media'|'series'|'season'|'episode'
}

export interface PriceItem {
  id: number
  type: 'currency' | 'points'
  currency: string
  currencySymbol: string
  value: number
  billingType: BillingType
  rentalPeriodUnit: RentalPeriodUnit
  rentalPeriodValue: number
}

export interface PurchaseInfo {
  priceList: PriceItem[]
  subscriptionId: string
  clientPurchaseEnabled: boolean
  offerVersion: string
}

export interface ProductInfo {
  id: string // JSDoc said PriceItem, likely error. Product ID usually string.
  title: string
  summary: boolean // JSDoc says boolean??
  description: string
  type: string
  items: PurchaseItem[][]
  purchasePeriod: Period
  consumptionPeriod: Period
  ageRating: string
  purchaseInfo: PurchaseInfo[]
}

export interface SubscriptionInfo {
  id: string // JSDoc said PriceItem
  title: string
  description: string
  type: 'basic' | 'extra'
  items: string
  purchasePeriod: Period
  consumptionPeriod: Period
  purchaseInfo: PurchaseInfo[]
}

export interface ImdbRating {
  rating: number
  totalVotes: number
}

export interface Media {
  id: string
  purchaseInfo: ContentPurchaseInfo
  audios: string[]
  subtitles: string[]
  quality: 'SD' | 'HD' | 'UHD' | 'NOT_AVAILABLE'
  is3D: boolean
}

export interface VodContent {
  id: string
  type: ContentType | string
  categoryId: string
  isFavorite: boolean
  isNew: boolean
  title: string
  poster: Poster
  ageRating: number
  description: string
  summary: string
  year: number
  countries: string[]
  genres: string[]
  purchaseInfo: ContentPurchaseInfo
  contentActions: ContentActions

  // Extended properties from Video/Series type in GQL
  metascore?: number
  tomatoRating?: number
  userRating?: number
  contentInfoId?: number
  releaseDate?: number
  runtimeInMinutes?: number
  directors?: string[]
  cast?: string[]
  writers?: string[]
  producers?: string[]
  imdb?: ImdbRating
  autoBookmarkOffset?: string[]
  medias?: Media[]

  // Series specific
  seriesId?: string
  contentCount?: number

  // Episode specific
  episodeNumber?: number
}

export interface VodCategoryCacheInfo {
  validFrom: number
  categories: Category[]
}

export interface VodContentCacheInfo {
  validFrom: number
  contents: VodContent[]
}

export enum BookmarkType {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
}

export interface Bookmark {
  contentUid: string
  offset: number
  created?: number
  deviceDescription?: string
  audioLanguage?: string
  subtitleLanguage?: string
  type: BookmarkType
}

export interface BookmarkListResponse {
  list: Bookmark[]
}

export interface CreateBookmarkParams {
  bookmark_type: BookmarkType
  device_uid: string
  device_desc: string
  subtitle_language?: string
  audio_language?: string
}

export interface DeleteBookmarkParams {
  bookmark_type: BookmarkType
  device_uid: string
}

export interface GetVodLibrariesParams {
  language: string
  type: 'on-demand'
}

export interface VodLibraryInfoDto {
  id: string
  title: string
}

export interface GraphQLBody {
  query: string
  variables?: Record<string, any>
}
