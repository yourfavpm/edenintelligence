'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import sidebarSections from './navigation';
import { DropdownMenu } from './ui/DropdownMenu';
import { useAuth } from './auth/AuthContext';
import SearchBar from './SearchBar';

// =============================================================================
// Layout Component - Praxiom Master Redesign (Final Polish)
// =============================================================================

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userMenuItems = [
    {
      id: 'profile',
      label: 'Settings',
      href: '/settings',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    }
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-neutral-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Mobile Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50 lg:hidden transition-all" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar: Institutional Navy */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 bg-[#0F172A] text-[#CBD5F5] flex flex-col
          transition-all duration-300 ease-in-out border-r border-[#1E293B]
          ${isCollapsed ? 'w-16' : 'w-[230px]'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Branding */}
        <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'}`}>
          <Link href="/dashboard" className="flex items-center transition-transform hover:scale-105 active:scale-95">
            <div className={`
              ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'} 
              bg-white/5 rounded-xl flex items-center justify-center 
              border border-white/10 shadow-2xl shadow-black/20 shrink-0
            `}>
               <img src="/logo.png" alt="P" className={`${isCollapsed ? 'h-6' : 'h-8'} w-auto brightness-110 contrast-125`} />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-7 overflow-y-auto no-scrollbar">
          {sidebarSections.map((section) => (
            <div key={section.title} className="px-3">
              {!isCollapsed && (
                <h3 className="px-3 mb-2 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.25em]">
                  {section.title}
                </h3>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center rounded-lg font-bold text-[12px] transition-all h-9 relative group
                        ${isCollapsed ? 'justify-center' : 'px-3 gap-3'}
                        ${isActive ? 'bg-[#1E293B] text-white' : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/50'}
                      `}
                    >
                      <span className={`shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'text-[#64748B] group-hover:text-[#94A3B8]'}`}>
                        {React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-[18px] h-[18px]' }) : item.icon}
                      </span>
                      {!isCollapsed && <span className="truncate tracking-wide">{item.label}</span>}
                      {isActive && !isCollapsed && <div className="ml-auto w-1 h-1 rounded-full bg-indigo-500" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User context & Logout */}
        <div className="p-3 border-t border-[#1E293B] space-y-2">
          {user && (
            <>
              <DropdownMenu
                items={userMenuItems}
                trigger={
                  <button className={`flex items-center w-full rounded-xl hover:bg-[#1E293B] transition-all outline-none group ${isCollapsed ? 'justify-center py-2' : 'p-2 gap-3'}`}>
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] text-indigo-400">
                      {user.display_name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-[12px] font-bold text-white truncate leading-none mb-0.5">{user.display_name || 'User'}</p>
                        <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-tighter truncate">Active</p>
                      </div>
                    )}
                  </button>
                }
              />
              
              <button 
                onClick={logout}
                className={`
                  flex items-center w-full rounded-xl transition-all outline-none group
                  text-red-400 hover:bg-red-500/10 hover:text-red-300
                  ${isCollapsed ? 'justify-center py-2' : 'p-2 gap-3'}
                `}
              >
                <div className={`flex items-center justify-center shrink-0 ${isCollapsed ? 'w-8 h-8' : ''}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                {!isCollapsed && <span className="text-[12px] font-bold tracking-wide">Logout</span>}
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden overflow-y-auto">
        <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-white border-b border-[#E5E7EB] sticky top-0 z-30 gap-10">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) setSidebarOpen(true);
                else setIsCollapsed(!isCollapsed);
              }}
              className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="hidden md:block flex-1 max-w-lg">
              <SearchBar placeholder="Search meetings and notes..." />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => router.push('/record')} className="hidden sm:flex items-center gap-2 px-3.5 h-9 bg-white border border-[#E5E7EB] rounded-lg text-[11px] font-bold text-neutral-900 uppercase tracking-widest hover:bg-neutral-50 transition-all shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Record
              </button>
              <button onClick={() => router.push('/uploads')} className="flex items-center gap-2 px-3.5 h-9 bg-[#0F172A] rounded-lg text-[11px] font-bold text-white uppercase tracking-widest hover:bg-black transition-all shadow-md shadow-black/5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Upload
              </button>
            </div>
            <div className="h-4 w-px bg-neutral-200 mx-1 hidden sm:block" />
            <button className="p-2 text-neutral-400 hover:text-indigo-600 transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full ring-2 ring-white" />
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
