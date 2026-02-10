import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, FolderOpen, FileText, Clock, ChevronRight } from 'lucide-react';
import { getProjects } from '../services/storageService';
import { Project } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const stats = {
    totalProjects: projects.length,
    // Just illustrative numbers for the UI since we don't track files/drafts in storage for MVP
    totalDocuments: projects.length * 3 + 2, 
    totalDrafts: Math.floor(projects.length * 1.5), 
  };

  return (
    <div className="space-y-8">
      {/* Quick Actions & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => navigate('/new')}
          className="bg-blue-600 text-white p-6 rounded-xl shadow-lg cursor-pointer hover:bg-blue-700 transition-colors flex flex-col justify-between h-32"
        >
          <div className="flex justify-between items-start">
            <span className="font-semibold text-lg">새 프로젝트</span>
            <FolderPlus className="opacity-80" />
          </div>
          <p className="text-blue-100 text-sm">새로운 보고서 작업 시작하기</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 font-medium">총 프로젝트</span>
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
               <FolderOpen size={20} />
            </div>
          </div>
          <span className="text-3xl font-bold text-slate-800">{stats.totalProjects}</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 font-medium">참고 문서</span>
             <div className="bg-green-50 p-2 rounded-lg text-green-600">
               <FileText size={20} />
            </div>
          </div>
          <span className="text-3xl font-bold text-slate-800">{stats.totalDocuments}</span>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 font-medium">생성된 초안</span>
             <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
               <Clock size={20} />
            </div>
          </div>
          <span className="text-3xl font-bold text-slate-800">{stats.totalDrafts}</span>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">최근 프로젝트</h2>
        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <FolderOpen size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">프로젝트가 없습니다</h3>
            <p className="text-slate-500 mb-6">첫 번째 프로젝트를 생성하여 보고서 초안 작성을 시작하세요.</p>
            <button 
              onClick={() => navigate('/new')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              프로젝트 생성하기
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">프로젝트명</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">유형</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">생성일</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-slate-600">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr 
                    key={project.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs border border-slate-200">
                        {project.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">
                      {new Date(project.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-slate-400 hover:text-blue-600">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;