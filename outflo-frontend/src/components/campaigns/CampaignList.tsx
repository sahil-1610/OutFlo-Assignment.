import { useState } from "react";
import { Campaign } from "@/types/campaign";
import { Eye, Edit, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import CampaignForm from "./CampaignForm";
import { campaignService } from "@/services/campaignService";

interface CampaignListProps {
  campaigns: Campaign[];
  onRefresh: () => void;
}

const CampaignList = ({ campaigns, onRefresh }: CampaignListProps) => {
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await campaignService.deleteCampaign(id);
      toast.success("Campaign deleted successfully");
      onRefresh();
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditSave = () => {
    setIsEditing(false);
    setEditCampaign(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns?.map((campaign) => (
          <div
            key={campaign._id}
            className="bg-white rounded-lg shadow p-6 card-hover"
          >
            <div className="flex justify-between items-start mb-4">
              <h3
                className="font-semibold text-lg text-gray-900 truncate"
                title={campaign.name}
              >
                {campaign.name}
              </h3>
              {/* <div className="flex items-center space-x-1">
                <Badge
                  key={`status-${campaign._id}`}
                  variant={
                    campaign.status === "ACTIVE" ? "default" : "secondary"
                  }
                >
                  {campaign.status === "ACTIVE" ? (
                    <Check
                      key={`check-${campaign._id}`}
                      className="w-3 h-3 mr-1"
                    />
                  ) : (
                    <X key={`x-${campaign._id}`} className="w-3 h-3 mr-1" />
                  )}
                  {campaign.status}
                </Badge>
              </div> */}
            </div>

            <p
              className="text-gray-500 text-sm mb-4 line-clamp-2"
              title={campaign.description}
            >
              {campaign.description}
            </p>

            <div
              key={`stats-${campaign._id}`}
              className="flex items-center justify-between mb-4"
            >
              <div
                key={`leads-${campaign._id}`}
                className="text-sm text-gray-600"
              >
                <span>Leads: </span>
                <span className="font-medium">{campaign.leadsCount || 0}</span>
              </div>

              <div
                key={`urls-${campaign._id}`}
                className="text-sm text-gray-600"
              >
                <span>LinkedIn URLs: </span>
                <span className="font-medium">
                  {campaign.linkedInUrls?.length || 0}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Status:</span>
                <Badge
                  key={`status-bottom-${campaign._id}`}
                  variant={
                    campaign.status === "ACTIVE" ? "default" : "secondary"
                  }
                >
                  {campaign.status}
                </Badge>
              </div>

              <div className="flex space-x-2">
                <Button
                  key={`edit-btn-${campaign._id}`}
                  variant="outline"
                  size="sm"
                  className="text-gray-600"
                  onClick={() => {
                    setEditCampaign(campaign);
                    setIsEditing(true);
                  }}
                >
                  <Edit key={`edit-icon-${campaign._id}`} className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                  onClick={() => handleDelete(campaign._id)}
                  disabled={isDeleting === campaign._id}
                >
                  {isDeleting === campaign._id ? (
                    <div
                      key={`spinner-${campaign._id}`}
                      className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"
                    />
                  ) : (
                    <Trash2 key={`trash-${campaign._id}`} className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={isEditing}
        onOpenChange={(open) => !open && setIsEditing(false)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Make changes to your campaign here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editCampaign && (
            <CampaignForm
              campaign={editCampaign}
              onSuccess={handleEditSave}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignList;
