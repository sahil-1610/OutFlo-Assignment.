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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { messageService } from "@/services/messageService";
import {
  GenerateMessageRequest,
  GenerateMessageResponse,
} from "@/types/message";
import MessagePreview from "./MessagePreview";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").nonempty("Name is required"),
  job_title: z
    .string()
    .min(1, "Job title is required")
    .nonempty("Job title is required"),
  company: z
    .string()
    .min(1, "Company is required")
    .nonempty("Company is required"),
  location: z
    .string()
    .min(1, "Location is required")
    .nonempty("Location is required"),
  summary: z
    .string()
    .min(1, "Summary is required")
    .nonempty("Summary is required"),
});

// Explicitly type the schema to match GenerateMessageRequest
type FormSchema = z.infer<typeof formSchema> & GenerateMessageRequest;
type FormValues = z.infer<typeof formSchema>;

const MessageForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      job_title: "",
      company: "",
      location: "",
      summary: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Explicitly cast values as GenerateMessageRequest since we've validated it
      const request: GenerateMessageRequest = {
        name: values.name,
        job_title: values.job_title,
        company: values.company,
        location: values.location,
        summary: values.summary,
      };

      const response = await messageService.generateMessage(request);
      setGeneratedMessage(response.message);
    } catch (error) {
      console.error("Error generating message:", error);
      setError("Failed to generate message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="job_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="San Francisco, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Profile Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short summary of the person's LinkedIn profile"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              "Generate Message"
            )}
          </Button>
        </form>
      </Form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {generatedMessage && <MessagePreview message={generatedMessage} />}
    </div>
  );
};

export default MessageForm;
