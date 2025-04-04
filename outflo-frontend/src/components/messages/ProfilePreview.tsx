
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, User, Briefcase, Building, MapPin, FileText } from 'lucide-react';
import { GenerateMessageFromUrlResponse } from '@/types/message';
import { toast } from 'sonner';

interface ProfilePreviewProps {
  profile: GenerateMessageFromUrlResponse;
}

const ProfilePreview = ({ profile }: ProfilePreviewProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profile.message);
      setCopied(true);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy message');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-brand-100 shadow-md">
        <CardHeader className="bg-brand-50 border-b border-brand-100">
          <CardTitle className="text-brand-800">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6 divide-y divide-gray-100">
          <div className="py-3 flex items-start">
            <User className="w-5 h-5 text-brand-500 mt-0.5 mr-3" />
            <div>
              <div className="text-sm text-gray-500 font-medium">Name</div>
              <div className="text-gray-700">{profile.name}</div>
            </div>
          </div>
          
          <div className="py-3 flex items-start">
            <Briefcase className="w-5 h-5 text-brand-500 mt-0.5 mr-3" />
            <div>
              <div className="text-sm text-gray-500 font-medium">Job Title</div>
              <div className="text-gray-700">{profile.job_title}</div>
            </div>
          </div>
          
          <div className="py-3 flex items-start">
            <Building className="w-5 h-5 text-brand-500 mt-0.5 mr-3" />
            <div>
              <div className="text-sm text-gray-500 font-medium">Company</div>
              <div className="text-gray-700">{profile.company}</div>
            </div>
          </div>
          
          <div className="py-3 flex items-start">
            <MapPin className="w-5 h-5 text-brand-500 mt-0.5 mr-3" />
            <div>
              <div className="text-sm text-gray-500 font-medium">Location</div>
              <div className="text-gray-700">{profile.location}</div>
            </div>
          </div>
          
          <div className="py-3 flex items-start">
            <FileText className="w-5 h-5 text-brand-500 mt-0.5 mr-3" />
            <div>
              <div className="text-sm text-gray-500 font-medium">Summary</div>
              <div className="text-gray-700">{profile.summary}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-brand-100 shadow-md">
        <CardHeader className="bg-brand-50 border-b border-brand-100">
          <CardTitle className="text-brand-800">Generated Message</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="whitespace-pre-line text-gray-700">
            {profile.message}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 flex justify-end p-4">
          <Button
            variant="outline"
            size="sm"
            className={copied ? 'bg-green-50 text-green-600 border-green-200' : ''}
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Message
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePreview;
