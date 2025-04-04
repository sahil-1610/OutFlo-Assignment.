
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MessageForm from '@/components/messages/MessageForm';
import UrlMessageForm from '@/components/messages/UrlMessageForm';

const MessageGenerator = () => {
  const [activeTab, setActiveTab] = useState<string>('manual');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">LinkedIn Message Generator</h1>
        <p className="text-gray-500 mt-2">
          Create personalized LinkedIn messages based on profile information
        </p>
      </div>

      <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="manual">Manual Input</TabsTrigger>
          <TabsTrigger value="profile">LinkedIn URL</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="manual" className="space-y-4">
            <div className="bg-brand-50 border border-brand-100 rounded-lg p-4 text-brand-800">
              <h3 className="font-medium mb-1">Manual Profile Information</h3>
              <p className="text-sm">
                Enter the prospect's details manually to generate a personalized message.
              </p>
            </div>
            <MessageForm />
          </TabsContent>
          <TabsContent value="profile" className="space-y-4">
            <div className="bg-brand-50 border border-brand-100 rounded-lg p-4 text-brand-800">
              <h3 className="font-medium mb-1">LinkedIn Profile URL</h3>
              <p className="text-sm">
                Enter a LinkedIn profile URL to automatically extract information and generate a personalized message.
              </p>
            </div>
            <UrlMessageForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MessageGenerator;
