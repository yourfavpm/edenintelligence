'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import sidebarSections from './navigation';
import { useAuth } from './auth/AuthContext';
import SearchBar from './SearchBar';
import { 
  Menu, 
  X, 
  Search, 
  Mic, 
  Upload, 
  Bell, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical
} from 'lucide-react';

// =============================================================================
// Layout Component - Eden Intelligence Redesign
// =============================================================================

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F7F8FB] text-[#1F2937] font-sans selection:bg-[#A5A0FF]/20 selection:text-[#6C63FF]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-[#0A1B3D]/40 backdrop-blur-sm z-50 lg:hidden transition-all animate-fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar: Deep Blue (#0A1B3D) */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 bg-[#0A1B3D] text-[#E5E7EB] flex flex-col
          transition-all duration-300 ease-in-out border-r border-white/5 shadow-2xl
          ${isCollapsed ? 'w-20' : 'w-[240px]'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-6 justify-between'}`}>
          <Link href="/dashboard" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group">
            <div className="w-8 h-8 bg-[#6C63FF] rounded-lg flex items-center justify-center shadow-lg shadow-[#6C63FF]/20">
               <span className="text-white font-bold text-[15px] tracking-tight">E</span>
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-white tracking-tight text-[16px]">Eden Intelligence</span>
            )}
          </Link>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1 rounded-md text-[#94A3B8] hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-4 space-y-8 overflow-y-auto no-scrollbar scroll-smooth">
          {sidebarSections.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="px-6 mb-3 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.2em] opacity-80">
                  {section.title}
                </h3>
              )}
              <div className="space-y-0.5 px-3">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center rounded-lg font-medium text-[13px] transition-all h-10 relative group
                        ${isCollapsed ? 'justify-center' : 'px-4 gap-3'}
                        ${isActive ? 'bg-white/10 text-white' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}
                      `}
                    >
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-[-12px] top-2 bottom-2 w-1 rounded-r-full bg-[#6C63FF] shadow-[2px_0_8px_rgb(108,99,255,0.4)]" />
                      )}
                      
                      <span className={`shrink-0 transition-colors ${isActive ? 'text-[#6C63FF]' : 'text-[#64748B] group-hover:text-[#94A3B8]'}`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="truncate tracking-wide">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
          {user && (
            <div className="flex flex-col gap-2">
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-2 py-2'}`}>
                <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#A5A0FF] flex items-center justify-center font-bold text-[11px] text-white shadow-sm ring-2 ring-white/10">
                  {user.display_name?.[0] || user.email[0].toUpperCase()}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[13px] font-semibold text-white truncate leading-none mb-1">{user.display_name || 'User'}</p>
                    <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider truncate">Active</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={logout}
                className={`
                  flex items-center w-full rounded-lg transition-all outline-none group
                  text-[#94A3B8] hover:bg-white/5 hover:text-white
                  ${isCollapsed ? 'justify-center h-10' : 'px-4 gap-3 h-10'}
                `}
              >
                <LogOut size={16} className="group-hover:text-red-400 transition-colors" />
                {!isCollapsed && <span className="text-[13px] font-medium tracking-wide group-hover:text-red-400">Logout</span>}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar: 64px Height */}
        <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-white border-b border-[#E5E7EB] sticky top-0 z-30 gap-10 shadow-sm shadow-black/[0.01]">
          <div className="flex items-center gap-6 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-400 hover:text-[#6C63FF] hover:bg-[#F7F8FB] rounded-lg transition-all"
            >
              <Menu size={20} />
            </button>
            
            <h1 className="hidden lg:block text-[14px] font-semibold text-neutral-400 mr-2 capitalize">
              {pathname?.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
            </h1>

            {/* Global Search Bar */}
            <div className="hidden md:flex flex-1 max-w-[420px] relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#6C63FF] transition-colors">
                <Search size={16} />
              </div>
              <input 
                 type="text" 
                 placeholder="Search meetings and transcripts..." 
                 className="w-full h-10 pl-10 pr-4 bg-[#F7F8FB] border border-[#E5E7EB] rounded-full text-[13px] outline-none focus:border-[#6C63FF]/30 focus:ring-4 focus:ring-[#6C63FF]/5 transition-all text-neutral-900"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => router.push('/record')} 
                className="hidden sm:flex items-center gap-2 px-4 h-9 bg-white border border-[#E5E7EB] rounded-lg text-[12px] font-semibold text-neutral-700 hover:bg-[#F7F8FB] hover:border-[#6C63FF]/20 transition-all shadow-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Record
              </button>
              <button 
                onClick={() => router.push('/uploads')} 
                className="flex items-center gap-2 px-4 h-9 bg-[#6C63FF] rounded-lg text-[12px] font-semibold text-white hover:bg-[#5B54E0] transition-all shadow-lg shadow-[#6C63FF]/20 translate-z-0 active:scale-95"
              >
                <Upload size={14} />
                Upload
              </button>
            </div>
            
            <div className="h-4 w-px bg-neutral-200 mx-1 hidden sm:block" />
            
            <button className="p-2 text-neutral-400 hover:text-[#6C63FF] transition-all relative rounded-full hover:bg-[#F7F8FB]">
              <Bell size={20} strokeWidth={1.8} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#6C63FF] rounded-full ring-2 ring-white" />
            </button>

            {user && (
              <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[11px] font-bold text-neutral-600 sm:hidden">
                 {user.display_name?.[0] || user.email[0].toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 overflow-y-auto bg-[#F7F8FB] scroll-smooth p-6 lg:p-8 xl:p-12">
          <div className="max-w-[1200px] mx-auto animate-fade-in pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
