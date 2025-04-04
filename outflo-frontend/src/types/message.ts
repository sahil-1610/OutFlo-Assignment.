export interface LinkedInProfile {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

export interface GenerateMessageRequest {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

export interface GenerateMessageResponse {
  message: string;
}

export interface GenerateMessageFromUrlRequest {
  linkedinUrl: string;
}

export interface GenerateMessageFromUrlResponse extends LinkedInProfile {
  message: string;
}
