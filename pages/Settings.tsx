import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import { getSettings, saveSettings } from '../services/storageService';

const Settings: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = getSettings();
    setWebhookUrl(settings.webhookUrl);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings({ webhookUrl });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">설정</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="webhookUrl" className="block text-sm font-medium text-slate-700 mb-1">
              n8n Webhook URL
            </label>
            <p className="text-sm text-slate-500 mb-3">
              초안 생성을 처리할 n8n 워크플로우의 Webhook URL을 입력하세요.
            </p>
            <input
              id="webhookUrl"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
              required
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm">
             <AlertTriangle className="shrink-0" size={20} />
             <div>
               <p className="font-semibold mb-1">주의사항</p>
               <p>이 URL은 브라우저에서 직접 호출됩니다. n8n 인스턴스에 CORS 설정이 되어 있는지 확인해주세요.</p>
             </div>
          </div>

          <div className="pt-4 flex justify-end items-center gap-4">
            {saved && (
              <span className="text-green-600 text-sm font-medium animate-fade-in">
                설정이 저장되었습니다.
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium shadow-sm"
            >
              <Save size={18} />
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;