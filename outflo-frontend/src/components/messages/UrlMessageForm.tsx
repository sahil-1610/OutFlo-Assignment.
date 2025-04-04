import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { messageService } from "@/services/messageService";
import { GenerateMessageFromUrlResponse } from "@/types/message";
import ProfilePreview from "./ProfilePreview";

const formSchema = z.object({
  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .min(1, "LinkedIn URL is required"),
});

type FormValues = z.infer<typeof formSchema>;
type GenerateMessageFromUrlRequest = {
  linkedinUrl: string;
};

const UrlMessageForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] =
    useState<GenerateMessageFromUrlResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkedinUrl: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      setProfileData(null);

      const request: GenerateMessageFromUrlRequest = {
        linkedinUrl: values.linkedinUrl,
      };
      const response = await messageService.generateMessageFromUrl(request);
      setProfileData(response);
    } catch (error) {
      console.error("Error generating message from URL:", error);
      setError(
        "Failed to generate message. The LinkedIn profile may be private or the URL is invalid."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">LinkedIn Profile URL</FormLabel>
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

          <Button
            type="submit"
            className="w-full sm:w-auto text-sm h-9"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing Profile...
              </>
            ) : (
              "Generate Personalized Message"
            )}
          </Button>
        </form>
      </Form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      {profileData && <ProfilePreview profile={profileData} />}
    </div>
  );
};

export default UrlMessageForm;
