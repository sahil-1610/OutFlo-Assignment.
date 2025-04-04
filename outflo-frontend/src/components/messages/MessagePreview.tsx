
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface MessagePreviewProps {
  message: string;
}

const MessagePreview = ({ message }: MessagePreviewProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy message');
    }
  };

  return (
    <Card className="border-brand-100 shadow-md">
      <CardHeader className="bg-brand-50 border-b border-brand-100">
        <CardTitle className="text-brand-800">Generated Message</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="whitespace-pre-line text-gray-700">
          {message}
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
  );
};

export default MessagePreview;
