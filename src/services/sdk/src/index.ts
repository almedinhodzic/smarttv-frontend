// Export Config & Core
export * from "./config";
export * from "./http-client";
export * from "./services/base.service";

// Export Models
export * from "./models/core";
export * from "./models/auth";
export * from "./models/channel";
export * from "./models/content";
export * from "./models/misc";
export * from "./models/transaction";
export * from "./models/messaging";
export * from "./models/dashboard";
export * from "./models/registration";
export * from "./models/advanced";

// Export Services
export * from "./services/auth.service";
export * from "./services/channel.service";
export * from "./services/user.service";
export * from "./services/user-info.service";
export * from "./services/system.service";
export * from "./services/device.service";
export * from "./services/configuration.service";
export * from "./services/vod.service";
export * from "./services/epg.service";
export * from "./services/search.service";
export * from "./services/series.service";
export * from "./services/media-resource.service";
export * from "./services/generic.service";
export * from "./services/thumbnail.service";
export * from "./services/product.service";
export * from "./services/terms-of-conduct.service";
export * from "./services/location.service";
export * from "./services/payment.service";
export * from "./services/subscription.service";
export * from "./services/messaging.service";
export * from "./services/dashboard.service";
export * from "./services/statistics.service";
export * from "./services/advertisement.service";
export * from "./services/registration.service";
export * from "./services/recording.service";
export * from "./services/timeshift.service";
export * from "./services/drm.service";
export * from "./services/csl.service";
export * from "./services/download.service";
export * from "./services/reminder.service";
export * from "./services/tokenization.service";
export * from "./services/license.service";

import { SdkConfig } from "./config";
import { HttpClient } from "./http-client";

import { AuthService } from "./services/auth.service";
import { ChannelService } from "./services/channel.service";
import { UserService } from "./services/user.service";
import { UserInfoService } from "./services/user-info.service";
import { SystemService } from "./services/system.service";
import { DeviceService } from "./services/device.service";
import { ConfigurationService } from "./services/configuration.service";
import { VodService } from "./services/vod.service";
import { EpgService } from "./services/epg.service";
import { SearchService } from "./services/search.service";
import { SeriesService } from "./services/series.service";
import { MediaResourceService } from "./services/media-resource.service";
import { GenericService } from "./services/generic.service";
import { ThumbnailService } from "./services/thumbnail.service";
import { ProductService } from "./services/product.service";
import { TermsOfConductService } from "./services/terms-of-conduct.service";
import { LocationService } from "./services/location.service";
import { PaymentService } from "./services/payment.service";
import { SubscriptionService } from "./services/subscription.service";
import { MessagingService } from "./services/messaging.service";
import { DashboardService } from "./services/dashboard.service";
import { StatisticsService } from "./services/statistics.service";
import { AdvertisementService } from "./services/advertisement.service";
import { RegistrationService } from "./services/registration.service";
import { RecordingService } from "./services/recording.service";
import { TimeshiftService } from "./services/timeshift.service";
import { DrmService } from "./services/drm.service";
import { ConcurrentStreamLimitationService } from "./services/csl.service";
import { DownloadService } from "./services/download.service";
import { ReminderService } from "./services/reminder.service";
import { TokenizationService } from "./services/tokenization.service";
import { LicenseService } from "./services/license.service";

export class SmartTvSdk {
  private httpClient: HttpClient;

  public auth: AuthService;
  public channel: ChannelService;
  public user: UserService;
  public userInfo: UserInfoService;
  public system: SystemService;
  public device: DeviceService;
  public configuration: ConfigurationService;
  public vod: VodService;
  public epg: EpgService;
  public search: SearchService;
  public series: SeriesService;
  public mediaResource: MediaResourceService;
  public generic: GenericService;
  public thumbnail: ThumbnailService;
  public product: ProductService;
  public toc: TermsOfConductService;
  public location: LocationService;
  public payment: PaymentService;
  public subscription: SubscriptionService;
  public messaging: MessagingService;
  public dashboard: DashboardService;
  public statistics: StatisticsService;
  public advertisement: AdvertisementService;
  public registration: RegistrationService;
  public recording: RecordingService;
  public timeshift: TimeshiftService;
  public drm: DrmService;
  public csl: ConcurrentStreamLimitationService;
  public download: DownloadService;
  public reminder: ReminderService;
  public tokenization: TokenizationService;
  public license: LicenseService;

  constructor(config: SdkConfig) {
    this.httpClient = new HttpClient(config);

    this.auth = new AuthService(this.httpClient);
    this.channel = new ChannelService(this.httpClient);
    this.user = new UserService(this.httpClient);
    this.userInfo = new UserInfoService(this.httpClient);
    this.system = new SystemService(this.httpClient);
    this.device = new DeviceService(this.httpClient);
    this.configuration = new ConfigurationService(this.httpClient);
    this.vod = new VodService(this.httpClient);
    this.epg = new EpgService(this.httpClient);
    this.search = new SearchService(this.httpClient);
    this.series = new SeriesService(this.httpClient);
    this.mediaResource = new MediaResourceService(this.httpClient);
    this.generic = new GenericService(this.httpClient);
    this.thumbnail = new ThumbnailService(this.httpClient);
    this.product = new ProductService(this.httpClient);
    this.toc = new TermsOfConductService(this.httpClient);
    this.location = new LocationService(this.httpClient);
    this.payment = new PaymentService(this.httpClient);
    this.subscription = new SubscriptionService(this.httpClient);
    this.messaging = new MessagingService(this.httpClient);
    this.dashboard = new DashboardService(this.httpClient);
    this.statistics = new StatisticsService(this.httpClient);
    this.advertisement = new AdvertisementService(this.httpClient);
    this.registration = new RegistrationService(this.httpClient);
    this.recording = new RecordingService(this.httpClient);
    this.timeshift = new TimeshiftService(this.httpClient);
    this.drm = new DrmService(this.httpClient);
    this.csl = new ConcurrentStreamLimitationService(this.httpClient);
    this.download = new DownloadService(this.httpClient);
    this.reminder = new ReminderService(this.httpClient);
    this.tokenization = new TokenizationService(this.httpClient);
    this.license = new LicenseService(this.httpClient);
  }

  public setAuthToken(token: string) {
    this.httpClient.setAuthToken(token);
  }

  public clearAuthToken() {
    this.httpClient.clearAuthToken();
  }
}
