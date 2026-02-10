import { DraftResult, SectionType, WebhookResponse } from '../types';

interface GenerateDraftParams {
  webhookUrl: string;
  projectName: string;
  projectType: string;
  sectionType: SectionType;
  additionalInstructions: string;
  files: File[];
}

export const generateDraft = async ({
  webhookUrl,
  projectName,
  projectType,
  sectionType,
  additionalInstructions,
  files
}: GenerateDraftParams): Promise<DraftResult> => {
  
  if (!webhookUrl) {
    throw new Error("Webhook URL이 설정되지 않았습니다. 설정 페이지에서 URL을 입력해주세요.");
  }

  const formData = new FormData();
  formData.append('projectName', projectName);
  formData.append('projectType', projectType);
  formData.append('sectionType', sectionType);
  formData.append('additionalInstructions', additionalInstructions);
  
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
      // Content-Type header is handled automatically by fetch for FormData
    });

    if (!response.ok) {
      throw new Error(`서버 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data: WebhookResponse = await response.json();
    
    // Validate response structure
    if (typeof data.content !== 'string') {
        throw new Error("서버 응답 형식이 올바르지 않습니다 (content 누락)");
    }

    return {
      content: data.content,
      citations: Array.isArray(data.citations) ? data.citations : []
    };

  } catch (error) {
    console.error("Draft generation failed:", error);
    throw error;
  }
};