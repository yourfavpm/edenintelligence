// =============================================================================
// Sidebar Navigation Configuration - Claeron
// =============================================================================

import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  ListTodo, 
  Mic, 
  Upload, 
  Users, 
  Settings 
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const sidebarSections: NavSection[] = [
  {
    title: 'Workspace',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { href: '/meetings', label: 'Meetings', icon: <Calendar size={18} /> },
      { href: '/upcoming-meetings', label: 'Upcoming Meetings', icon: <Calendar size={18} /> },
      { href: '/action-items', label: 'Action Items', icon: <ListTodo size={18} /> },
    ],
  },
  {
    title: 'Input',
    items: [
      { href: '/record', label: 'Record Meeting', icon: <Mic size={18} /> },
      { href: '/uploads', label: 'Upload Audio', icon: <Upload size={18} /> },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/team', label: 'Team Members', icon: <Users size={18} /> },
      { href: '/settings', label: 'Settings', icon: <Settings size={18} /> },
    ],
  },
];

// Legacy flat export for backward compatibility
export const sidebarNav: NavItem[] = sidebarSections.flatMap(section => section.items);

export default sidebarSections;
