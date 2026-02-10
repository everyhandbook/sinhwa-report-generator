import { ReportSection } from './types';

export const DEFAULT_WEBHOOK_URL = "https://your-n8n-instance.com/webhook/heritage-report-draft";

export const PROJECT_TYPES = [
  "문화재 보수정비",
  "도시생태현황",
  "환경영향평가",
  "기타"
];

export const REPORT_SECTIONS: ReportSection[] = [
  {
    id: '일반현황',
    title: '일반현황',
    description: '대상지의 기본 정보를 요약합니다.',
    items: ['위치/면적', '연혁', '지정현황', '자연/인문환경']
  },
  {
    id: '실태조사',
    title: '실태조사',
    description: '현장 조사 결과를 분석합니다.',
    items: ['보존상태', '훼손현황', '수리이력', '구조안전성']
  },
  {
    id: '유사사례',
    title: '유사사례',
    description: '관련 사례를 통한 시사점을 도출합니다.',
    items: ['사례개요', '정비내용', '적용기법', '시사점']
  }
];

export const STORAGE_KEYS = {
  PROJECTS: 'shinhwa_projects',
  SETTINGS: 'shinhwa_settings'
};

// Allowed file types for input
export const ALLOWED_FILE_TYPES = ".pdf,.docx,.hwp,.txt,.md,.xlsx,.csv,.pptx";