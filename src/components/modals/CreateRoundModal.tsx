'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface CreateRoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRound: (name: string, date: string, note?: string) => void;
}

export default function CreateRoundModal({
  isOpen,
  onClose,
  onCreateRound,
}: CreateRoundModalProps) {
  const todayStr = () => new Date().toISOString().split('T')[0];
  const thaiDateStr = () => {
    return new Date().toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const [name, setName] = useState<string>(`รอบ GVG ${thaiDateStr()}`);
  const [date, setDate] = useState<string>(todayStr);
  const [note, setNote] = useState<string>('ดรอปจากกิลด์วอร์รอบหลัก');

  if (!isOpen) return null;

  const handleQuickName = (title: string) => {
    setName(`${title} ${thaiDateStr()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('กรุณาระบุชื่อรอบการประมูล');
      return;
    }
    onCreateRound(name.trim(), date, note.trim() || undefined);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-rose-500/40 bg-[#0d121f] p-5 sm:p-6 shadow-2xl space-y-4 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-xl border border-rose-500/40 text-amber-400">
              🎯
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                สร้างรอบการประมูลใหม่ (New Round)
              </h3>
              <p className="text-xs text-slate-400">
                เพิ่มรอบใหม่เพื่อจัดกลุ่มของดรอปและเก็บประวัติการสุ่มย้อนหลัง
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-base p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              เลือกชื่อรอบด่วน:
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickName('รอบ GVG')}
                className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-[11px] font-bold text-slate-300 transition cursor-pointer"
              >
                ⚔️ รอบ GVG
              </button>
              <button
                type="button"
                onClick={() => handleQuickName('รอบ Siege War')}
                className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-[11px] font-bold text-slate-300 transition cursor-pointer"
              >
                🏰 รอบ Siege War
              </button>
              <button
                type="button"
                onClick={() => handleQuickName('รอบศึกชิงปราสาท')}
                className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-[11px] font-bold text-slate-300 transition cursor-pointer"
              >
                🛡️ รอบศึกชิงปราสาท
              </button>
            </div>
          </div>

          {/* Round Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ชื่อรอบการประมูล / วันที่: <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น รอบ GVG วันที่ 25 ต.ค. 2569"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              วันที่จัดรอบ:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              หมายเหตุ / แหล่งที่มา (Note):
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น ดรอปจากบ้านปราสาท 1 / หลังจบวอร์"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-xs font-extrabold text-white shadow-lg shadow-rose-950/40 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>+</span>
              <span>สร้างรอบใหม่และเริ่มใช้งาน</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

