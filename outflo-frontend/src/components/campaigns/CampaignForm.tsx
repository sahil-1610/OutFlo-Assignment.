import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Campaign, CampaignFormData, CampaignStatus } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";
import { campaignService } from "@/services/campaignService";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["ACTIVE", "INACTIVE"]) as z.ZodEnum<["ACTIVE", "INACTIVE"]>,
  linkedInUrls: z
    .array(
      z.object({
        value: z.string().url("Please enter a valid LinkedIn URL"),
      })
    )
    .min(1, "At least one LinkedIn URL is required"),
  accountIds: z
    .array(
      z.object({
        value: z.string().min(1, "Account ID cannot be empty"),
      })
    )
    .min(1, "At least one Account ID is required"),
});

interface CampaignFormProps {
  campaign?: Campaign;
  onSuccess: () => void;
  onCancel: () => void;
}

const CampaignForm = ({ campaign, onSuccess, onCancel }: CampaignFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: campaign?.name || "",
      description: campaign?.description || "",
      status:
        (campaign?.status === "DELETED" ? "INACTIVE" : campaign?.status) ||
        "INACTIVE",
      linkedInUrls: campaign?.linkedInUrls?.map((url) => ({ value: url })) || [
        { value: "" },
      ],
      accountIds: campaign?.accountIds?.map((id) => ({ value: id })) || [
        { value: "" },
      ],
    },
  });

  const {
    fields: linkedInFields,
    append: appendLinkedIn,
    remove: removeLinkedIn,
  } = useFieldArray({
    control: form.control,
    name: "linkedInUrls",
  });

  const {
    fields: accountFields,
    append: appendAccount,
    remove: removeAccount,
  } = useFieldArray({
    control: form.control,
    name: "accountIds",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const formData: CampaignFormData = {
        name: values.name,
        description: values.description,
        status: values.status as CampaignStatus,
        linkedInUrls: values.linkedInUrls.map((item) => item.value),
        accountIds: values.accountIds.map((item) => item.value),
      };

      if (campaign?._id) {
        await campaignService.updateCampaign(campaign._id, formData);
        toast.success("Campaign updated successfully");
      } else {
        await campaignService.createCampaign(formData);
        toast.success("Campaign created successfully");
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting campaign form:", error);
      toast.error("Failed to save campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Campaign Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter campaign name"
                  {...field}
                  className="text-sm"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter campaign description"
                  className="min-h-[80px] text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-sm h-9">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel className="text-sm">LinkedIn URLs</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendLinkedIn({ value: "" })}
              className="h-7 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add URL
            </Button>
          </div>

          {linkedInFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`linkedInUrls.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1 mb-0">
                    <FormControl>
                      <Input
                        placeholder="https://www.linkedin.com/in/username"
                        {...field}
                        className="text-sm h-9"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              {linkedInFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLinkedIn(index)}
                  className="h-9 w-9"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel className="text-sm">Account IDs</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendAccount({ value: "" })}
              className="h-7 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Account
            </Button>
          </div>

          {accountFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`accountIds.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1 mb-0">
                    <FormControl>
                      <Input
                        placeholder="Enter account ID"
                        {...field}
                        className="text-sm h-9"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              {accountFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAccount(index)}
                  className="h-9 w-9"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            size="sm"
            className="text-xs h-8"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="sm"
            className="text-xs h-8"
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {campaign ? "Updating..." : "Creating..."}
              </>
            ) : campaign ? (
              "Update Campaign"
            ) : (
              "Create Campaign"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CampaignForm;
