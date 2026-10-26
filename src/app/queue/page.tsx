'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import AdminQueueView from '@/components/queue/AdminQueueView';

export default function AdminQueuePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/queue/join');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <span className="text-4xl">📋</span>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          กำลังพาคุณไปยังหน้าลงชื่อต่อคิวสำหรับสมาชิก...
        </h2>
        <p className="text-xs text-slate-400 max-w-sm">
          หน้านี้สำหรับแอดมินจัดการคิว หากคุณเป็นสมาชิกทั่วไป สามารถกดปุ่มด้านล่างเพื่อเข้าหน้าต่อคิวได้ทันที
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/queue/join"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition shadow-md shadow-indigo-950/40"
          >
            👉 ไปหน้าต่อคิวสำหรับสมาชิก (/queue/join)
          </Link>
          <Link
            href="/login?redirect=/queue"
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
          >
            🔑 แอดมินเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  return <AdminQueueView />;
}
