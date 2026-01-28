'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import sidebarSections from './navigation';
import { DropdownMenu } from './ui/DropdownMenu';
import { useAuth } from './auth/AuthContext';
import SearchBar from './SearchBar';
import ActionDropdown from './ActionDropdown';

// =============================================================================
// Layout Component - Enterprise Edition
// =============================================================================

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userMenuItems = [
    {
      id: 'profile',
      label: 'Profile Settings',
      href: '/settings',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    { id: 'divider', label: '', divider: true },
    {
      id: 'logout',
      label: 'Sign out',
      onClick: logout,
      danger: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Redesigned */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-neutral-900 text-white flex flex-col
          transform transition-transform duration-200 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Eden Intelligence
            </span>
          </Link>
        </div>

        {/* Navigation - Sectioned */}
        <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
          {sidebarSections.map((section, sectionIndex) => (
            <div key={section.title}>
              {/* Section Header */}
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>

              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all relative
                        ${isActive
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                        }
                      `}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r" />
                      )}
                      <span className={isActive ? 'text-primary-400' : ''}>{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Divider between sections (except last) */}
              {sectionIndex < sidebarSections.length - 1 && (
                <div className="mt-6 border-t border-white/10" />
              )}
            </div>
          ))}
        </nav>

        {/* User info at bottom */}
        {user && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium text-sm">
                {user.display_name?.[0] || user.email[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.display_name || 'User'}
                </p>
                <p className="text-xs text-neutral-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
        {/* Top header */}
        <header className="h-20 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-neutral-200 sticky top-0 z-20 gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-neutral-600 hover:text-neutral-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search Bar - Moved to header */}
            <div className="hidden md:block flex-1 max-w-md">
              <SearchBar />
            </div>
          </div>

          {/* Page title placeholder - removed spacer */}

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Quick Record - Moved to header & Restyled */}
            <button
              onClick={() => router.push('/record')}
              className="group relative flex items-center justify-center w-10 h-10 bg-error-50 text-error-600 rounded-full hover:bg-error-100 hover:text-error-700 transition-all border border-error-100 shadow-sm overflow-hidden"
              title="Quick Record"
            >
              <div className="absolute inset-0 bg-error-600/10 animate-pulse group-hover:animate-none" />
              <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="6" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            </button>

            {/* Action Dropdown - Moved to header */}
            <div className="hidden sm:block">
              <ActionDropdown />
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-neutral-200 mx-1 hidden sm:block" />

            {/* Notifications placeholder */}
            <button className="p-2 text-neutral-500 hover:text-neutral-700 transition-colors bg-neutral-50 rounded-lg border border-neutral-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* User menu */}
            {user && (
              <DropdownMenu
                items={userMenuItems}
                trigger={
                  <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors border border-transparent hover:border-neutral-200">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium text-xs">
                      {user.display_name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-neutral-700">
                      {user.display_name?.split(' ')[0] || user.email.split('@')[0]}
                    </span>
                    <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                }
              />
            )}
          </div>
        </header>

        {/* Mobile Search - Visible only on small screens */}
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 sticky top-20 z-10">
          <SearchBar />
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
