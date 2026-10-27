'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import AdminNavActions from './AdminNavActions';
import ThemeToggle from './ThemeToggle';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'GVG ทัพหลัก', href: '/gvg', icon: '⚔️' },
  { label: 'Siege ปราสาท', href: '/siege', icon: '🏰' },
  { label: 'Polarity สงครามดาว', href: '/polarity', icon: '✨' },
  { label: 'ตี้ประจำ (Squads)', href: '/squads', icon: '👥' },
  { label: 'จัดการสมาชิก', href: '/roster', icon: '🛡️' },
  { label: 'กิจกรรมประจำสัปดาห์', href: '/events', icon: '📅' },
  { label: 'ประมูลไอเทม', href: '/auction', icon: '💎' },
  { label: 'จัดการคิว', href: '/queue', icon: '📋' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  // Hide navbar on login, public viewer, leave request, public auctions, and member queue pages
  if (
    pathname === '/login' ||
    pathname === '/public' ||
    pathname === '/leave' ||
    pathname === '/auctions' ||
    pathname === '/auction/join' ||
    pathname === '/queues' ||
    pathname === '/queue/join'
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-[1700px] px-3 py-2 sm:px-6">
        {/* Row 1: Brand & Admin Tools */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
          {/* Guild Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/gvg" className="flex items-center gap-2 transition hover:opacity-90">
              <span className="text-base sm:text-lg font-black tracking-wider bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
                Moonz
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                Guild Manager
              </span>
            </Link>
          </div>

          {/* Quick action / Theme Toggle / Auth */}
          <div className="flex items-center gap-2 flex-wrap">
            <ThemeToggle />
            {isAuthenticated ? (
              <AdminNavActions />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-600/30 hover:bg-indigo-600/50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-200 transition"
              >
                <span>🔑</span>
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}
          </div>
        </div>

        {/* Row 2: Navigation Tabs (เรียง 2 บรรทัด หรือ Wrap อัตโนมัติ ไม่ต้องเลื่อนปัด) */}
        <nav className="flex items-center gap-1 sm:gap-1.5 flex-wrap pt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/gvg' && pathname === '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-500/15 dark:bg-indigo-600/30 border border-indigo-400 dark:border-indigo-500/50 text-indigo-700 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
