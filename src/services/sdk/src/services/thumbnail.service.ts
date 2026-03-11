import { BaseService } from "./base.service";
import { API_ENDPOINTS } from "../config";
import { ThumbnailBucket } from "../models/content";

export class ThumbnailService extends BaseService {
  public async getThumbnailBucket(
    regionId: string,
    contentUid: string,
  ): Promise<ThumbnailBucket> {
    return this.httpClient.get<ThumbnailBucket>(
      `${API_ENDPOINTS.THUMB}/${regionId}/content/${contentUid}/thumbnail-bucket`,
    );
  }

  // Returning URLs as this is not something axios fetches typically (Streaming response in Kotlin usually means bytes/buffer)
  // but in JS/TS clients we usually construct the URL for the img tag.
  // If we need to fetch blob, we'd use responseType: 'blob' with axios.
  // For now I'll create a method that generates the URL, and another that fetches the Blob.

  public getThumbnailImageUrl(
    regionId: string,
    thumbnailBucketUid: string,
    format: string,
  ): string {
    return `${this.httpClient["axiosInstance"].defaults.baseURL}${API_ENDPOINTS.THUMB}/${regionId}/thumbnail-buckets/${thumbnailBucketUid}/thumbnails/t.${format}`;
  }

  public getThumbnailImageWithOffsetUrl(
    regionId: string,
    thumbnailBucketUid: string,
    position: string,
    offset: string,
    format: string,
  ): string {
    return `${this.httpClient["axiosInstance"].defaults.baseURL}${API_ENDPOINTS.THUMB}/${regionId}/thumbnail-buckets/${thumbnailBucketUid}/thumbnails/${position}/${offset}/t.${format}`;
  }
}
