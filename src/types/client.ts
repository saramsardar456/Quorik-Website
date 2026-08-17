export interface VoiceConversation {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  date: string;
  durationSeconds: number;
  durationMinutes: number;
  topic: string;
  transcriptSummary: string;
  leadCaptured: boolean;
  status: 'completed' | 'dropped';
}

export interface ClientAccount {
  id: string;
  clientName: string;
  businessName: string;
  industry: string;
  email: string;
  phone: string;
  websiteUrl: string;
  tier: 'starter' | 'growth' | 'enterprise';
  monthlyVoiceMinutesLimit: number;
  voiceMinutesUsed: number;
  monthlyTextChatLimit: number;
  textChatsUsed: number;
  status: 'active' | 'limit_reached' | 'paused';
  voiceAgentName: string;
  voiceLanguage: string;
  totalConversations: number;
  leadsCaptured: number;
  lastActive: string;
  conversations: VoiceConversation[];
  createdAt: string;
}
