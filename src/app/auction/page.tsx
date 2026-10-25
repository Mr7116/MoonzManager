'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useGuildStore } from '@/lib/guildStore';
import { AuctionItem } from '@/types/auction';
import AddAuctionModal from '@/components/modals/AddAuctionModal';
import RegisterMembersModal from '@/components/modals/RegisterMembersModal';
import LuckyWheelModal from '@/components/modals/LuckyWheelModal';
import AutoSaveBadge from '@/components/common/AutoSaveBadge';
import JobEmblem from '@/components/tactical/JobEmblem';

export default function AuctionPage() {
  const {
    guildName,
    members,
    auctionItems,
    addAuctionItems,
    startAuction,
    startAllPendingAuctions,
    addMemberToAuction,
    removeMemberFromAuction,
    setAuctionWinner,
    resetAuctionWinner,
    deleteAuctionItem,
  } = useGuildStore();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'ended'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [registerAuctionId, setRegisterAuctionId] = useState<string | null>(null);
  const [wheelAuctionId, setWheelAuctionId] = useState<string | null>(null);

  // Active items for modals (always fetched from live state)
  const registerAuction = useMemo(() => {
    return auctionItems.find((a) => a.id === registerAuctionId) || null;
  }, [auctionItems, registerAuctionId]);

  const wheelAuction = useMemo(() => {
    return auctionItems.find((a) => a.id === wheelAuctionId) || null;
  }, [auctionItems, wheelAuctionId]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return auctionItems.filter((item) => {
      if (activeTab === 'pending' && item.status !== 'pending') return false;
      if (activeTab === 'active' && item.status !== 'active') return false;
      if (activeTab === 'ended' && item.status !== 'ended') return false;

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchName = item.accessoryName.toLowerCase().includes(q);
        const matchWinner = item.winnerMemberName?.toLowerCase().includes(q);
        const matchSource = item.sourceNote?.toLowerCase().includes(q);
        const matchEntry = (item.entries || []).some((e) => e.memberName.toLowerCase().includes(q));
        if (!matchName && !matchWinner && !matchSource && !matchEntry) return false;
      }
      return true;
    });
  }, [auctionItems, activeTab, search]);

  // Statistics
  const stats = useMemo(() => {
    const pendingCount = auctionItems.filter((a) => a.status === 'pending').length;
    const activeCount = auctionItems.filter((a) => a.status === 'active').length;
    const endedCount = auctionItems.filter((a) => a.status === 'ended').length;
    const totalEntriesCount = auctionItems.reduce((sum, a) => sum + (a.entries?.length || 0), 0);

    return {
      pendingCount,
      activeCount,
      endedCount,
      totalEntriesCount,
    };
  }, [auctionItems]);

  const handleStartAuction = (item: AuctionItem) => {
    startAuction(item.id);
  };

  const handleStartAllPending = () => {
    if (stats.pendingCount === 0) return;
    if (window.confirm(`คุณต้องการเปิดรับรายชื่อไอเทมทั้งหมดที่รออยู่จำนวน ${stats.pendingCount} ชิ้นพร้อมกันหรือไม่?`)) {
      startAllPendingAuctions();
    }
  };

  const handleDeletePrompt = (item: AuctionItem) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรายการ "${item.accessoryName}"?`)) {
      deleteAuctionItem(item.id);
    }
  };

  const handleResetWinnerPrompt = (item: AuctionItem) => {
    if (window.confirm(`คุณต้องการรีเซ็ตผลผู้ชนะของ "${item.accessoryName}" เพื่อเปิดรับรายชื่อหรือสุ่มใหม่หรือไม่?`)) {
      resetAuctionWinner(item.id);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-6 space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-rose-500/30 bg-white dark:bg-[#0d121f]/95 p-4 sm:p-5 shadow-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-amber-500/20 text-2xl border border-rose-500/40 shadow-sm text-amber-400">
            🎡
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-wide">
                สุ่มแจกไอเทมกิลด์ด้วยวงล้อ (Lucky Wheel Raffle) — {guildName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 border border-rose-500/40 text-rose-700 dark:text-rose-300">
                💎 Accessory Quality = Red (Lv.90)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              เพิ่มรายการของดรอปเป็น List ให้สมาชิกส่งรายชื่อเข้ามา แล้วสุ่มหาผู้โชคดีด้วยวงล้อสุ่ม (Lucky Wheel)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <AutoSaveBadge />

          {stats.pendingCount > 0 && (
            <button
              type="button"
              onClick={handleStartAllPending}
              className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 transition cursor-pointer"
            >
              <span>▶️</span>
              <span>เปิดรับรายชื่อทั้งหมด ({stats.pendingCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-950/40 transition cursor-pointer"
          >
            <span>+</span>
            <span>เพิ่มของประมูล (เป็น List)</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Pending */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-3.5 sm:p-4 shadow-sm flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-xl border border-amber-500/40 text-amber-400 shrink-0">
            ⏳
          </span>
          <div>
            <div className="text-[11px] font-semibold text-amber-400/90">รอเปิดรับรายชื่อ (Pending)</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-300">
              {stats.pendingCount} <span className="text-xs font-sans text-slate-400">ชิ้น</span>
            </div>
          </div>
        </div>

        {/* 2. Active */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-3.5 sm:p-4 shadow-sm flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-xl border border-emerald-500/40 text-emerald-400 shrink-0">
            🟢
          </span>
          <div>
            <div className="text-[11px] font-semibold text-emerald-400/90">เปิดรับรายชื่อ / พร้อมสุ่ม</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-300">
              {stats.activeCount} <span className="text-xs font-sans text-slate-400">ชิ้น</span>
            </div>
          </div>
        </div>

        {/* 3. Ended */}
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/15 p-3.5 sm:p-4 shadow-sm flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-xl border border-indigo-500/40 text-indigo-400 shrink-0">
            🏆
          </span>
          <div>
            <div className="text-[11px] font-semibold text-indigo-400/90">สุ่มได้ผู้ชนะแล้ว (Ended)</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-300">
              {stats.endedCount} <span className="text-xs font-sans text-slate-400">ชิ้น</span>
            </div>
          </div>
        </div>

        {/* 4. Total Registered Members */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/15 p-3.5 sm:p-4 shadow-sm flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-xl border border-rose-500/40 text-rose-400 shrink-0">
            👥
          </span>
          <div>
            <div className="text-[11px] font-semibold text-rose-400/90">ยอดคนลงชื่อร่วมชิงสะสม</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-rose-300">
              {stats.totalEntriesCount} <span className="text-xs font-sans text-slate-400">คน</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d121f] p-3 shadow-sm">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ทั้งหมด ({auctionItems.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
          >
            <span>⏳ รอเปิดรับรายชื่อ</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
              {stats.pendingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'active'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
            }`}
          >
            <span>🟢 เปิดรับรายชื่อ / พร้อมสุ่ม</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
              {stats.activeCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ended')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'ended'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-300 hover:bg-slate-800'
            }`}
          >
            <span>🏆 ได้ผู้ชนะแล้ว</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
              {stats.endedCount}
            </span>
          </button>
        </div>

        {/* Search & View Mode Switch */}
        <div className="flex items-center gap-2.5">
          <input
            type="text"
            placeholder="ค้นหาชื่อไอเทม, ผู้ชนะ, ผู้ลงชื่อ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-rose-500 focus:outline-none w-48 sm:w-64"
          />

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-800 text-rose-500 dark:text-rose-300 shadow-sm'
                  : 'text-slate-500 hover:text-white'
              }`}
              title="แสดงผลแบบรายการ (List)"
            >
              <span>📋</span>
              <span className="hidden sm:inline">รายการ</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-rose-500 dark:text-rose-300 shadow-sm'
                  : 'text-slate-500 hover:text-white'
              }`}
              title="แสดงผลแบบการ์ด (Grid)"
            >
              <span>🎴</span>
              <span className="hidden sm:inline">การ์ด</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auction Items List / Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center space-y-3">
          <span className="text-4xl">🎡</span>
          <h3 className="text-base font-bold text-slate-300">ไม่พบรายการที่ตรงกับเงื่อนไข</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {auctionItems.length === 0
              ? 'ยังไม่มีรายการไอเทมในกิลด์ คลิกปุ่ม "+ เพิ่มของประมูล (เป็น List)" ด้านบนเพื่อเริ่มรายการแรก'
              : 'ลองเปลี่ยนคำค้นหาหรือแท็บตัวกรองด้านบนเพื่อดูรายการอื่นๆ'}
          </p>
          {auctionItems.length === 0 && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white transition shadow cursor-pointer"
            >
              <span>+ เพิ่มของประมูล (เป็น List)</span>
            </button>
          )}
        </div>
      ) : viewMode === 'list' ? (
        /* ===== LIST VIEW (แบบรายการ) ===== */
        <div className="space-y-2.5">
          {filteredItems.map((item, index) => {
            const isPending = item.status === 'pending';
            const isActive = item.status === 'active';
            const isEnded = item.status === 'ended';
            const entryCount = (item.entries || []).length;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 transition shadow-sm ${
                  isActive
                    ? 'border-emerald-500/40 bg-gradient-to-r from-[#0d1527] to-[#0c1a24] hover:border-emerald-500/70'
                    : isPending
                    ? 'border-amber-500/30 bg-[#0d121f] hover:border-amber-500/60'
                    : 'border-slate-800 bg-[#0a0e18]/80 opacity-90'
                }`}
              >
                {/* Left: Thumbnail & Item Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-xs font-mono font-bold text-slate-500 w-5 text-right shrink-0">
                    {index + 1}.
                  </span>

                  <div className="relative w-13 h-13 shrink-0 rounded-xl border border-rose-500/40 bg-[#080d19] flex items-center justify-center shadow-md">
                    <Image
                      src={`/images/accessories/${item.accessoryIcon}.webp`}
                      alt={item.accessoryName}
                      width={44}
                      height={44}
                      unoptimized
                      className="object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://roworlddb.com/media/images/item/${item.accessoryIcon}.webp`;
                      }}
                    />
                    {item.accessoryLevel && (
                      <span className="absolute bottom-0 right-0 px-1 py-0.2 rounded text-[8px] font-bold bg-black/90 border border-slate-700 text-amber-300 font-mono">
                        Lv.{item.accessoryLevel}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-white tracking-wide truncate">
                        {item.accessoryName}
                      </h4>

                      {/* Status Badge */}
                      {isPending && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <span>⏳</span>
                          <span>รอเปิดรับรายชื่อ</span>
                        </span>
                      )}
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>เปิดรับรายชื่อ / พร้อมหมุน</span>
                        </span>
                      )}
                      {isEnded && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                          <span>🏆</span>
                          <span>ได้ผู้ชนะแล้ว</span>
                        </span>
                      )}
                    </div>

                    {item.sourceNote && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        🏷️ {item.sourceNote}
                      </p>
                    )}
                  </div>
                </div>

                {/* Middle: Winner or Registered Entries count */}
                <div className="flex items-center gap-4 px-2 md:px-0 self-start md:self-center shrink-0">
                  <div className="text-left md:text-right">
                    {isEnded && item.winnerMemberName ? (
                      <div>
                        <div className="text-[10px] font-semibold text-slate-400">ผู้ชนะที่สุ่มได้:</div>
                        <div className="flex items-center md:justify-end gap-1.5 mt-0.5">
                          {item.winnerMemberJob && (
                            <JobEmblem job={item.winnerMemberJob} size={18} />
                          )}
                          <span className="text-base sm:text-lg font-black text-emerald-300 tracking-wide">
                            {item.winnerMemberName}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          จากผู้ลงชื่อทั้งหมด {entryCount} คน
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-[10px] font-semibold text-slate-400">
                          {isPending ? 'สถานะ:' : 'สมาชิกที่ส่งรายชื่อเข้ามา:'}
                        </div>
                        <div className="text-base sm:text-lg font-extrabold font-mono text-amber-400">
                          {isPending ? (
                            <span className="text-sm font-sans text-amber-300/90 font-bold">รอเปิดรับ</span>
                          ) : (
                            <>
                              {entryCount} <span className="text-xs font-sans text-slate-400 font-normal">คน</span>
                            </>
                          )}
                        </div>
                        {isActive && entryCount > 0 && (
                          <div className="text-[10px] text-emerald-400 font-medium">
                            พร้อมหมุนวงล้อสุ่ม 🎡
                          </div>
                        )}
                        {isActive && entryCount === 0 && (
                          <div className="text-[10px] text-slate-500">
                            ยังไม่มีคนส่งรายชื่อ
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {/* Action 1: START (เมื่อเป็น pending) */}
                  {isPending && (
                    <button
                      type="button"
                      onClick={() => handleStartAuction(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>▶️</span>
                      <span>เปิดรับรายชื่อ</span>
                    </button>
                  )}

                  {/* Action 2: REGISTER MEMBERS (เมื่อ active) */}
                  {isActive && (
                    <button
                      type="button"
                      onClick={() => setRegisterAuctionId(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>👥</span>
                      <span>ลงชื่อ ({entryCount})</span>
                    </button>
                  )}

                  {/* Action 3: LUCKY WHEEL (หมุนวงล้อ) */}
                  {isActive && (
                    <button
                      type="button"
                      onClick={() => setWheelAuctionId(item.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-extrabold shadow-md shadow-rose-950/40 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>🎡</span>
                      <span>หมุนวงล้อสุ่ม</span>
                    </button>
                  )}

                  {/* Re-roll or View Wheel (for ended) */}
                  {isEnded && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setWheelAuctionId(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <span>🎡</span>
                        <span>ดูวงล้อ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResetWinnerPrompt(item)}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer"
                        title="รีเซ็ตผู้ชนะเพื่อสุ่มใหม่"
                      >
                        🔄 สุ่มใหม่
                      </button>
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeletePrompt(item)}
                    className="p-1.5 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 text-xs transition cursor-pointer"
                    title="ลบรายการนี้"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ===== GRID VIEW (แบบการ์ด) ===== */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isPending = item.status === 'pending';
            const isActive = item.status === 'active';
            const isEnded = item.status === 'ended';
            const entryCount = (item.entries || []).length;

            return (
              <div
                key={item.id}
                className={`rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition-all shadow-md relative overflow-hidden group ${
                  isActive
                    ? 'border-emerald-500/40 bg-[#0d121f] hover:border-emerald-500/70 hover:shadow-emerald-500/10'
                    : isPending
                    ? 'border-amber-500/30 bg-[#0d121f] hover:border-amber-500/60'
                    : 'border-slate-800 bg-[#0a0e18]/80 opacity-90'
                }`}
              >
                {/* Top: Status Badge + Delete Button */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
                  <div className="flex items-center gap-1.5">
                    {isPending ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <span>⏳</span>
                        <span>รอเปิดรับรายชื่อ</span>
                      </span>
                    ) : isActive ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>เปิดรับรายชื่อ / พร้อมสุ่ม</span>
                      </span>
                    ) : isEnded ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        <span>🏆</span>
                        <span>ได้ผู้ชนะแล้ว</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        ยกเลิก
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                      Red
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isEnded && (
                      <button
                        type="button"
                        onClick={() => handleResetWinnerPrompt(item)}
                        className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[10px] font-bold transition cursor-pointer"
                        title="รีเซ็ตผู้ชนะเพื่อสุ่มใหม่"
                      >
                        🔄 สุ่มใหม่
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeletePrompt(item)}
                      className="text-slate-500 hover:text-rose-400 p-1 text-xs transition cursor-pointer"
                      title="ลบรายการนี้"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Middle: Item Details */}
                <div className="py-3.5 space-y-3 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="relative w-16 h-16 shrink-0 rounded-2xl border border-rose-500/50 bg-[#080d19] flex items-center justify-center shadow-lg shadow-rose-500/15 group-hover:scale-105 transition">
                      <Image
                        src={`/images/accessories/${item.accessoryIcon}.webp`}
                        alt={item.accessoryName}
                        width={54}
                        height={54}
                        unoptimized
                        className="object-contain drop-shadow"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://roworlddb.com/media/images/item/${item.accessoryIcon}.webp`;
                        }}
                      />
                      {item.accessoryLevel && (
                        <span className="absolute bottom-0 right-0 px-1.5 py-0.2 rounded text-[9px] font-bold bg-black/90 border border-slate-700 text-amber-300 font-mono">
                          Lv.{item.accessoryLevel}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-base text-white tracking-wide truncate" title={item.accessoryName}>
                        {item.accessoryName}
                      </h4>
                      {item.sourceNote && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          🏷️ {item.sourceNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Registered Info Box */}
                  <div className="p-3 rounded-2xl border border-slate-800 bg-[#080d19]/90 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400">
                        {isEnded ? 'ผู้ชนะจากการสุ่มวงล้อ:' : 'สมาชิกที่ส่งรายชื่อเข้ามา:'}
                      </span>
                      <span className="text-base font-extrabold font-mono text-amber-400">
                        {entryCount} <span className="text-xs font-sans text-slate-400 font-normal">คน</span>
                      </span>
                    </div>

                    {/* Winner or Participants summary */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                      {isEnded && item.winnerMemberName ? (
                        <span className="flex items-center gap-1.5 font-bold text-white w-full justify-between">
                          <span className="text-slate-400">ผู้ชนะ:</span>
                          <span className="flex items-center gap-1 text-emerald-300 font-bold">
                            {item.winnerMemberJob && (
                              <JobEmblem job={item.winnerMemberJob} size={18} />
                            )}
                            <span>{item.winnerMemberName}</span>
                          </span>
                        </span>
                      ) : isPending ? (
                        <span className="text-slate-500 font-medium">รอเปิดรับรายชื่อ</span>
                      ) : entryCount > 0 ? (
                        <span className="text-emerald-400 font-medium">พร้อมหมุนวงล้อสุ่ม 🎡</span>
                      ) : (
                        <span className="text-slate-500 font-medium">ยังไม่มีผู้ส่งรายชื่อ</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  {isPending ? (
                    <button
                      type="button"
                      onClick={() => handleStartAuction(item)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <span>▶️</span>
                      <span>เปิดรับรายชื่อรายการนี้</span>
                    </button>
                  ) : isActive ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setRegisterAuctionId(item.id)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <span>👥</span>
                        <span>ลงชื่อ ({entryCount})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWheelAuctionId(item.id)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-extrabold shadow-md shadow-rose-950/40 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <span>🎡</span>
                        <span>หมุนวงล้อ</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setWheelAuctionId(item.id)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>🎡</span>
                      <span>ดูวงล้อ / ผลสุ่ม ({entryCount} คน)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddAuctionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={(items) => {
          addAuctionItems(items);
        }}
      />

      <RegisterMembersModal
        isOpen={!!registerAuction}
        onClose={() => setRegisterAuctionId(null)}
        auction={registerAuction}
        members={members}
        onAddMember={(auctionId, memberId) => {
          addMemberToAuction(auctionId, memberId);
        }}
        onRemoveMember={(auctionId, memberId) => {
          removeMemberFromAuction(auctionId, memberId);
        }}
        onOpenWheel={() => {
          if (registerAuction) {
            setWheelAuctionId(registerAuction.id);
          }
        }}
      />

      <LuckyWheelModal
        isOpen={!!wheelAuction}
        onClose={() => setWheelAuctionId(null)}
        auction={wheelAuction}
        onConfirmWinner={(auctionId, winnerMemberId) => {
          setAuctionWinner(auctionId, winnerMemberId);
        }}
        onOpenRegisterModal={() => {
          if (wheelAuction) {
            setRegisterAuctionId(wheelAuction.id);
          }
        }}
      />
    </div>
  );
}
