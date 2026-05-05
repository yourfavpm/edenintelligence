'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import sidebarSections from './navigation';
import { useAuth } from './auth/AuthContext';
import { useUIStore } from '../store/useUIStore';
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
// Layout Component - Claeron Redesign
// =============================================================================

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    isCollapsed, 
    setIsCollapsed,
    toggleSidebar,
    toggleCollapsed
  } = useUIStore();

  return (
    <div className="min-h-screen flex bg-claeron-bg text-claeron-text font-sans selection:bg-claeron-accent/20 selection:text-claeron-primary">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-claeron-text/10 backdrop-blur-sm z-50 lg:hidden transition-all animate-fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar: White Soft Modern UI */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 bg-white text-claeron-text flex flex-col
          transition-all duration-300 ease-in-out border-r border-claeron-border shadow-[0_0_20px_rgba(0,0,0,0.02)]
          ${isCollapsed ? 'w-20' : 'w-[240px]'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-6 justify-between'}`}>
          <Link href="/dashboard" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group">
            <img src="/logo.png" alt="Logo" className="h-24 w-auto object-contain" />
          </Link>
          <button 
            onClick={toggleCollapsed}
            className="hidden lg:flex p-1 rounded-md text-claeron-muted hover:text-claeron-primary transition-colors hover:bg-claeron-bg"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-4 space-y-6 overflow-y-auto no-scrollbar scroll-smooth">
          {sidebarSections.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="px-6 mb-2 text-[12px] font-bold text-claeron-muted uppercase tracking-[0.1em]">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1 px-3">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center rounded-lg font-medium text-[14px] transition-all h-10 group
                        ${isCollapsed ? 'justify-center' : 'px-4 gap-3'}
                        ${isActive 
                          ? 'bg-claeron-accent/10 text-claeron-primary' 
                          : 'text-claeron-muted hover:text-claeron-text hover:bg-claeron-bg'}
                      `}
                    >
                      <span className={`shrink-0 transition-colors ${isActive ? 'text-claeron-primary' : 'text-claeron-muted group-hover:text-claeron-text'}`}>
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
        <div className="p-4 border-t border-claeron-border bg-white">
          {user && (
            <div className="flex flex-col gap-2">
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-2 py-2'}`}>
                <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-claeron-primary to-claeron-accent flex items-center justify-center font-bold text-[11px] text-white shadow-sm ring-2 ring-claeron-bg">
                  {user.display_name?.[0] || user.email[0].toUpperCase()}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[13px] font-semibold text-claeron-text truncate leading-none mb-1">{user.display_name || 'User'}</p>
                    <p className="text-[11px] text-claeron-muted font-medium truncate">Active Session</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={logout}
                className={`
                  flex items-center w-full rounded-button transition-all outline-none group
                  text-claeron-muted hover:bg-status-error-bg hover:text-status-error-text
                  ${isCollapsed ? 'justify-center h-10' : 'px-4 gap-3 h-10'}
                `}
              >
                <LogOut size={16} className="group-hover:text-status-error-text transition-colors" />
                {!isCollapsed && <span className="text-[13px] font-medium tracking-wide">Logout</span>}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar: 64px Height */}
        <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-white border-b border-claeron-border sticky top-0 z-30 shadow-soft">
          <div className="flex items-center gap-6 flex-1">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-claeron-muted hover:text-claeron-primary hover:bg-claeron-bg rounded-lg transition-all"
            >
              <Menu size={20} />
            </button>
            
            <h1 className="hidden lg:block text-[15px] font-medium text-claeron-text mr-2 capitalize">
              {pathname?.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
            </h1>

            {/* Global Search Bar */}
            <div className="hidden md:flex flex-1 max-w-[420px] relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-claeron-muted group-focus-within:text-claeron-primary transition-colors">
                <Search size={16} />
              </div>
              <input 
                 type="text" 
                 placeholder="Search meetings and transcripts..." 
                 className="w-full h-11 pl-10 pr-4 bg-claeron-bg border border-claeron-border rounded-input text-[14px] outline-none focus:border-claeron-primary/30 focus:ring-4 focus:ring-claeron-primary/5 transition-all text-claeron-text placeholder:text-claeron-muted"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => router.push('/record')} 
                className="hidden sm:flex items-center gap-2 px-4 h-10 bg-white border border-claeron-border rounded-button text-[14px] font-medium text-claeron-text hover:bg-claeron-bg transition-all shadow-soft"
              >
                <div className="w-2 h-2 rounded-full bg-status-error-base animate-pulse-soft" />
                Record
              </button>
              <button 
                onClick={() => router.push('/uploads')} 
                className="flex items-center gap-2 px-4 h-10 bg-claeron-primary rounded-button text-[14px] font-medium text-white hover:bg-claeron-indigo transition-all shadow-hover-soft active:scale-95"
              >
                <Upload size={16} />
                Upload
              </button>
            </div>
            
            <div className="h-6 w-px bg-claeron-border mx-1 hidden sm:block" />
            
            <button className="p-2 text-claeron-muted hover:text-claeron-primary transition-all relative rounded-full hover:bg-claeron-bg">
              <Bell size={20} strokeWidth={1.8} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-claeron-primary rounded-full ring-2 ring-white" />
            </button>

            {user && (
              <div className="w-8 h-8 rounded-full bg-claeron-bg border border-claeron-border flex items-center justify-center text-[12px] font-semibold text-claeron-text sm:hidden">
                 {user.display_name?.[0] || user.email[0].toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 overflow-y-auto bg-claeron-bg scroll-smooth p-6 lg:p-10 xl:p-12">
          <div className="max-w-[1200px] mx-auto animate-fade-in pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
