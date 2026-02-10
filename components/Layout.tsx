import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Settings, FileText, ChevronRight } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === '/') return '대시보드';
    if (location.pathname === '/new') return '새 프로젝트';
    if (location.pathname === '/settings') return '설정';
    if (location.pathname.startsWith('/project/')) return '프로젝트 상세';
    return '신화 보고서 초안 생성기';
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-blue-600 p-1 rounded-md text-white">
              <FileText size={20} />
            </span>
            신화엔지니어링
          </h1>
          <p className="text-xs text-slate-400 mt-1 pl-8">보고서 초안 생성기</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span>대시보드</span>
          </NavLink>

          <NavLink
            to="/new"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <PlusCircle size={20} />
            <span>새 프로젝트</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Settings size={20} />
            <span>설정</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center text-slate-500 text-sm">
             <span className="font-medium text-slate-900 text-lg mr-4">{getPageTitle()}</span>
          </div>
          <div className="text-sm text-slate-500">
            사용자: 문화유산팀
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;