import api from "@/lib/api";
import { API_ROUTES } from "@/config/apiConfig";
import { Campaign, CampaignFormData } from "@/types/campaign";

export const campaignService = {
  // Get all campaigns
  getAllCampaigns: async (): Promise<Campaign[]> => {
    const response = await api.get<Campaign[]>(API_ROUTES.campaigns.getAll);
    // Filter out deleted campaigns
    return response.data.filter((campaign) => campaign.status !== "DELETED");
  },

  // Get campaign by ID
  getCampaign: async (id: string): Promise<Campaign> => {
    const response = await api.get<Campaign>(API_ROUTES.campaigns.getById(id));
    return response.data;
  },

  // Create a new campaign
  createCampaign: async (campaign: CampaignFormData): Promise<Campaign> => {
    const response = await api.post<Campaign>(
      API_ROUTES.campaigns.create,
      campaign
    );
    return response.data;
  },

  // Update an existing campaign
  updateCampaign: async (
    id: string,
    campaign: CampaignFormData
  ): Promise<Campaign> => {
    if (!id) {
      throw new Error("Campaign ID is required");
    }
    const response = await api.put<Campaign>(
      API_ROUTES.campaigns.update(id),
      campaign
    );
    return response.data;
  },

  // Update campaign status
  updateCampaignStatus: async (
    id: string,
    status: "ACTIVE" | "INACTIVE"
  ): Promise<Campaign> => {
    if (!id) {
      throw new Error("Campaign ID is required");
    }
    const response = await api.put<Campaign>(
      API_ROUTES.campaigns.updateStatus(id),
      { status }
    );
    return response.data;
  },

  // Delete a campaign
  deleteCampaign: async (id: string): Promise<void> => {
    if (!id?.trim()) {
      throw new Error("Campaign ID is required");
    }

    try {
      await api.delete(API_ROUTES.campaigns.delete(id.trim()));
    } catch (error) {
      console.error("Error deleting campaign:", error);
      throw new Error("Failed to delete campaign");
    }
  },
};
