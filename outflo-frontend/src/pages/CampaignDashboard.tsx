import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Campaign } from "@/types/campaign";
import CampaignList from "@/components/campaigns/CampaignList";
import CampaignForm from "@/components/campaigns/CampaignForm";
import { campaignService } from "@/services/campaignService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const CampaignDashboard = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await campaignService.getAllCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      setError("Failed to load campaigns. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateSuccess = () => {
    setIsCreating(false);
    fetchCampaigns();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Campaign Dashboard
        </h1>
        <Button
          onClick={() => setIsCreating(true)}
          size="sm"
          className="text-sm h-9"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Campaign
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <Skeleton className="h-5 w-3/4 mb-3" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-2/3 mb-3" />
              <div className="flex justify-between mb-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <Skeleton className="h-5 w-12" />
                <div className="flex space-x-2">
                  <Skeleton className="h-7 w-7" />
                  <Skeleton className="h-7 w-7" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <h3 className="text-base font-medium text-gray-900 mb-2">
            No campaigns yet
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Create your first campaign to start reaching out to potential leads.
          </p>
          <Button
            onClick={() => setIsCreating(true)}
            size="sm"
            className="text-sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Create Campaign
          </Button>
        </div>
      ) : (
        <CampaignList campaigns={campaigns} onRefresh={fetchCampaigns} />
      )}

      <Dialog
        open={isCreating}
        onOpenChange={(open) => !open && setIsCreating(false)}
      >
        <DialogContent className="sm:max-w-[480px] p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg">Create Campaign</DialogTitle>
          </DialogHeader>
          <CampaignForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreating(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignDashboard;
