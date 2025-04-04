export type CampaignStatus = "ACTIVE" | "INACTIVE" | "DELETED";

export interface Campaign {
  _id: string; // Changed from id to _id to match MongoDB
  name: string;
  description: string;
  status: CampaignStatus;
  linkedInUrls: string[];
  accountIds: string[];
  leadsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignFormData {
  name: string;
  description: string;
  status: CampaignStatus;
  linkedInUrls: string[];
  accountIds: string[];
}
