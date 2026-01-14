export type Language = 'Español' | 'Inglés' | 'Portugués';
export type Tone = 'Formal' | 'Casual' | 'Profesional' | 'Amigable';

export interface ResponseConfig {
  short: number;
  medium: number;
  long: number;
}

export interface Assistant {
  id: string;
  name: string;
  language: Language;
  tone: Tone;
  responseParams: ResponseConfig;
  audioEnabled: boolean;
  rules?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface CreateAssistantDTO {
  name: string;
  language: Language;
  tone: Tone;
  responseParams: ResponseConfig;
  audioEnabled: boolean;
  rules?: string;
}

export interface UpdateAssistantDTO extends Partial<CreateAssistantDTO> {
  id: string;
}
