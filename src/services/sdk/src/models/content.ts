export interface SeriesProgramInfo {
  seriesUid?: string
  seriesOriginUid?: string
  seriesTitle?: string
  seasonUid?: string
  seasonNumber?: number
  episodeNumber?: number
  episodeUid?: string
  episodeTitle?: string
}

export interface ProgramDetails {
  actors?: string
  category?: string
  subcategory?: string
  countries?: string[]
  description?: string
  directors?: string
  externalUrl?: string
  genres?: string[]
  originalTitle?: string
  rating?: string
  shortDescription?: string
  year?: number
}

export interface Program {
  id: string
  title: string
  start: number // Changed from startTime to match Kotlin 'start'
  endTime?: number // Optional as start+duration might be used
  duration?: number
  description?: string
  details?: ProgramDetails
  imageUrl?: string
  backgroundImageUrl?: string
  channelId: string
  ageRating?: number
  recordable?: boolean
  barred?: boolean
  seriesInfo?: SeriesProgramInfo
}

export interface ProgramApiListResponse {
  list: Program[]
}

export interface GetProgramsParams {
  date?: string // yyyy-MM-dd
  include_details?: string // "true" | "false"
  language?: string
  page_size?: string
  time_zone?: string // +HHMM or -HHMM
  channel_id?: string
  channel_ids?: string
}

export interface ContentDetails {
  ageRatingDescription?: string
  year?: number
  director?: string
  genres?: string[]
  actors?: string
  writer?: string
  producer?: string
  description?: string
  awards?: string
  countries?: string
  imdbRating?: number
  metascore?: number
  rottenTomatoes?: number
  imdbId?: string
  imdbVotes?: string
  languages?: string[]
  releaseDate?: string
}

export interface ContentInfo {
  id: string
  title: string
  originalTitle?: string
  details?: ContentDetails
  posterPortrait?: string
  posterLandscape?: string
  ageRating: number
  libraryId?: string
}

export interface SeriesPromo {
  mediaResources?: any
  placeholderPicture?: string
  placeholderPictureLandscape?: string
  placeholderPicturePortrait?: string
}

export interface Series {
  id: string
  originUid?: string
  name: string
  title: string
  originalName?: string
  originalTitle?: string
  shortDescription?: string
  description?: string
  background?: string
  poster?: string
  posterPortrait?: string
  posterLandscape?: string
  ageRating?: number
  year?: number
  releaseDate?: string
  director?: string
  genres?: string[]
  actors?: string
  writer?: string
  producer?: string
  languages?: string[]
  awards?: string
  countries?: string[]
  imdbRating?: number
  imdbId?: string
  imdbVotes?: string
  metascore?: number
  rottenTomatoes?: number
  rottenTomatoesMeter?: number
  promo?: SeriesPromo
  seasons?: Season[]
  libraryId?: string
}

export enum SearchResultType {
  PROGRAM = 'PROGRAM',
  INFO = 'INFO',
}

export interface SearchResult {
  type: SearchResultType
  contentInfo?: ContentInfo
  program?: Program
  liveTv?: Program
  series?: Series
}

export enum SearchType {
  ALL = 'all', // obsolete
  EPG = 'epg',
  VOD = 'vod',
  LIVE_TV = 'live_tv',
  SERIES = 'series',
}

export enum SearchCriteria {
  NAME = 'name',
  DESCRIPTION = 'description',
  GENRE = 'GENRE',
  CAST = 'CAST',
}

export interface SearchParams {
  query: string
  search_type?: SearchType
  kids_mode?: string // "true" | "false"
  search_criteria?: string // comma-separated SearchCriteria
}

export interface Season {
  id: string
  seriesId: string
  seasonNumber: number
  name: string
  year?: number
  releaseDate?: string | null
  genres?: string[]
  countries?: string[]
  promo?: SeriesPromo | null
  episodes?: Episode[] | null
  episodesCount?: number
}

export interface SeriesListResponse<T> {
  list: T[]
  nextPageLink?: string | null
  pageNumber: number
  pageSize: number
  rowCount: number
}

export interface Episode {
  id: string
  seasonId: string
  seriesId: string
  episodeNumber: number
  title: string
  // add other fields
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  size: number
}

export interface MediaResourceOrchestration {
  dash: string
  hls: string
  drm: any
}

export interface ThumbnailBucket {
  id: string
  bucketUrl: string
  // details
}

// VOD GQL Responses
export interface VodLibraryInfoResponse {
  data: any // Complex GQL structure
}

export interface VodLibraryResponse {
  data: any
}

export interface CategoryResponse {
  data: any
}

export interface VodForCategoryResponse {
  data: any
}

export interface VodContentResponse {
  data: any
}

export interface VodContentsResponse {
  data: any
}
