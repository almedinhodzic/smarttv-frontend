export interface UserProfile {
  address: string | null;
  ageRating: number;
  authPin: string | null;
  autoAudio: boolean;
  autoLoginDevices: string[];
  autoReminderTime: number;
  autoSub: boolean;
  avatarImageUid: string;
  avatarResourceLink: string;
  birthDate: string | null;
  chatable: boolean;
  email: string | null;
  gender: string;
  id: string;
  idAvatar: number;
  idChannel: number | null;
  idChannelCategory: number | null;
  idProfile: number;
  idSkin: number;
  isDefault: boolean;
  language: string;
  linkDetails: string | null;
  name: string;
  nickname: string;
  pMessage: string | null;
  phoneNum: string | null;
  pinValidTill: number;
  status: 'ACTIVE' | string;
  subscriberUid: string;
  subscriberUuid: string;
  surname: string | null;
  tvRecommend: boolean;
  videoType: string | null;
  vodRecommend: boolean;
}

export interface UserProfilesResponse {
  list: UserProfile[];
  nextPageLink: string | null;
  pageNumber: number;
  pageSize: number;
  rowCount: number;
}
