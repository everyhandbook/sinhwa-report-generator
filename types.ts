export interface Project {
  id: string;
  name: string;
  type: string;
  createdAt: number;
}

export type SectionType = '일반현황' | '실태조사' | '유사사례';

export interface ReportSection {
  id: SectionType;
  title: string;
  description: string;
  items: string[];
}

export interface Citation {
  text: string;
  source: string;
  page?: string | number;
}

export interface DraftResult {
  content: string;
  citations: Citation[];
}

export interface WebhookResponse {
  content: string;
  citations: Citation[];
}

export interface AppSettings {
  webhookUrl: string;
}