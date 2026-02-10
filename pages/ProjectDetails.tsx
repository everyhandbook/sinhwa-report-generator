import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wand2, RefreshCw, Copy, Check, FileText, ExternalLink } from 'lucide-react';
import { getProjectById, getSettings } from '../services/storageService';
import { generateDraft } from '../services/apiService';
import { Project, SectionType, DraftResult } from '../types';
import { REPORT_SECTIONS } from '../constants';
import FileUploader from '../components/FileUploader';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedSection, setSelectedSection] = useState<SectionType>('일반현황');
  const [instructions, setInstructions] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DraftResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProject = getProjectById(id);
      if (foundProject) {
        setProject(foundProject);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleGenerate = async () => {
    if (!project || files.length === 0) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const settings = getSettings();

    try {
      const data = await generateDraft({
        webhookUrl: settings.webhookUrl,
        projectName: project.name,
        projectType: project.type,
        sectionType: selectedSection,
        additionalInstructions: instructions,
        files: files
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || "초안 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!project) return null;

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header with Breadcrumb-ish nav */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
                <p className="text-sm text-slate-500">{project.type}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* LEFT COLUMN: Inputs */}
        <div className="lg:col-span-5 space-y-6 overflow-y-auto pr-2">
          
          {/* 1. File Upload */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                자료 관리
            </h2>
            <FileUploader files={files} onFilesChange={setFiles} />
          </section>

          {/* 2. Section Selection */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                섹션 선택
            </h2>
            <div className="grid grid-cols-1 gap-3">
                {REPORT_SECTIONS.map((section) => (
                    <div
                        key={section.id}
                        onClick={() => setSelectedSection(section.id)}
                        className={`cursor-pointer border rounded-lg p-4 transition-all relative ${
                            selectedSection === section.id
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h3 className={`font-bold ${selectedSection === section.id ? 'text-blue-700' : 'text-slate-700'}`}>
                                {section.title}
                            </h3>
                            {selectedSection === section.id && <Check size={16} className="text-blue-600" />}
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{section.description}</p>
                        <div className="flex flex-wrap gap-1">
                            {section.items.map(item => (
                                <span key={item} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </section>

          {/* 3. Instructions & Action */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                생성 설정
            </h2>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">추가 지시사항 (선택)</label>
                <textarea 
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="예: 역사 부분을 좀 더 상세히 작성하고, 수치 데이터를 강조해주세요."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
            </div>

            <button
                onClick={handleGenerate}
                disabled={files.length === 0 || loading}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md ${
                    files.length === 0 || loading
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform active:scale-[0.98]'
                }`}
            >
                {loading ? (
                    <>
                        <RefreshCw className="animate-spin" />
                        초안 생성 중...
                    </>
                ) : (
                    <>
                        <Wand2 />
                        초안 생성하기
                    </>
                )}
            </button>
            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                    {error}
                </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="lg:col-span-7 h-full flex flex-col min-h-[500px]">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden relative">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h2 className="font-bold text-slate-700 flex items-center gap-2">
                        <FileText size={18} className="text-slate-400"/>
                        생성 결과: {selectedSection}
                    </h2>
                    {result && (
                        <div className="flex gap-2">
                             <button 
                                onClick={handleCopy}
                                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? "복사됨" : "복사하기"}
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-1 p-8 overflow-y-auto bg-white">
                    {!result && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <Wand2 size={48} className="mb-4 opacity-20" />
                            <p className="text-lg">왼쪽에서 자료를 업로드하고 생성 버튼을 눌러주세요.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="h-full flex flex-col items-center justify-center">
                             <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                             <p className="text-slate-600 font-medium text-lg">AI가 문서를 분석하고 초안을 작성 중입니다...</p>
                             <p className="text-slate-400 text-sm mt-2">문서 양에 따라 1~2분 정도 소요될 수 있습니다.</p>
                        </div>
                    )}

                    {result && (
                        <div className="prose prose-slate max-w-none">
                            <div className="whitespace-pre-wrap leading-relaxed text-slate-800 text-base">
                                {result.content}
                            </div>
                            
                            {result.citations && result.citations.length > 0 && (
                                <div className="mt-12 pt-6 border-t border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">참고 자료 및 출처</h3>
                                    <ul className="space-y-2">
                                        {result.citations.map((cite, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 group">
                                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <span className="text-slate-800 font-medium">"{cite.text}"</span>
                                                    <span className="block mt-1 text-blue-600 text-xs flex items-center gap-1 cursor-pointer hover:underline">
                                                        <ExternalLink size={10} />
                                                        {cite.source} {cite.page ? `(p.${cite.page})` : ''}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;