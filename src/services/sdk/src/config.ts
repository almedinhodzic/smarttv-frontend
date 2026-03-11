export const API_ENDPOINTS = {
  BS: "/api/bs/v10/consumer",
  MSG: "/api/msg/v1/consumer",
  IDM: "/api/idm/v1/consumer",
  VOD: "/api/lara/v2/consumer",
  GEO: "/api/geo/v1/consumer",
  STAT: "/api/stat/v2/consumer",
  THUMB: "/api/thumb/v1/consumer",
  ADTV: "/api/adtv/v3/consumer",
  TV_DASHBOARD: "/api/tvdashboard/v1/consumer",
  PAYMENT: "/api/payment/v2/consumer",
  CSL: "/api/csl/v1/consumer",
  TOC: "/api/toc/v1",
  WBE: "/api/wbe/v3/consumer",
};

export interface SdkConfig {
  baseUrl: string;
  debug?: boolean;
}
