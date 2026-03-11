export interface Recording {
  id: string;
  programId: string;
  startTime: number;
  duration: number;
  status: string;
  // other fields
}

export interface RecordingSet {
  recordingId: string;
  // other fields
}

export interface SeriesRecording {
  id: string;
  seriesId: string;
  status: string;
}

export interface Quota {
  total: number;
  used: number;
}

export interface VerimatrixDrmInfo {
  server: string;
  token: string;
}

export interface SessionInfo {
  sessionId: string;
  deviceId: string;
  creationTime: number;
}

export interface SessionContentInfo {
  contentId: string;
  contentType: string;
}

export interface ActiveSessionsInfo {
  sessions: SessionInfo[];
}

export interface SessionTTL {
  ttlSeconds: number;
}

export interface Reminder {
  id: string;
  programId: string;
  time: number;
}

export interface MediaResourceToken {
  token: string;
  validUntil: number;
}
