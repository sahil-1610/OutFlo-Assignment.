
import api from '@/lib/api';
import { API_ROUTES } from '@/config/apiConfig';
import { 
  GenerateMessageRequest, 
  GenerateMessageResponse, 
  GenerateMessageFromUrlRequest, 
  GenerateMessageFromUrlResponse 
} from '@/types/message';

export const messageService = {
  // Generate personalized message
  generateMessage: async (data: GenerateMessageRequest): Promise<GenerateMessageResponse> => {
    const response = await api.post<GenerateMessageResponse>(
      API_ROUTES.messages.generateFromProfile, 
      data
    );
    return response.data;
  },

  // Generate personalized message from LinkedIn URL
  generateMessageFromUrl: async (data: GenerateMessageFromUrlRequest): Promise<GenerateMessageFromUrlResponse> => {
    const response = await api.post<GenerateMessageFromUrlResponse>(
      API_ROUTES.messages.generateFromUrl, 
      data
    );
    return response.data;
  }
};
