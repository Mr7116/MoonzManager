'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useGuildStore } from '@/lib/guildStore';
import { AuctionItem } from '@/types/auction';
import AddAuctionModal from '@/components/modals/AddAuctionModal';
import PlaceBidModal from '@/components/modals/PlaceBidModal';
import BidHistoryModal from '@/components/modals/BidHistoryModal';
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
    placeBid,
    closeAuction,
    deleteAuctionItem,
    saveToCloud,
    isSaving,
  } = useGuildStore();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'ended'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [biddingAuction, setBiddingAuction] = useState<AuctionItem | null>(null);
  const [historyAuction, setHistoryAuction] = useState<AuctionItem | null>(null);

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
        if (!matchName && !matchWinner && !matchSource) return false;
      }
      return true;
    });
  }, [auctionItems, activeTab, search]);

  // Statistics
  const stats = useMemo(() => {
    const pendingCount = auctionItems.filter((a) => a.status === 'pending').length;
    const activeCount = auctionItems.filter((a) => a.status === 'active').length;
    const endedCount = auctionItems.filter((a) => a.status === 'ended').length;
    const totalBidsCount = auctionItems.reduce((sum, a) => sum + (a.bids?.length || 0), 0);
    const totalValue = auctionItems.reduce((sum, a) => sum + (a.currentPrice || a.startPrice || 0), 0);

    return {
      pendingCount,
      activeCount,
      endedCount,
      totalBidsCount,
      totalValue,
    };
  }, [auctionItems]);

  const handleStartAuction = (item: AuctionItem) => {
    startAuction(item.id);
  };

  const handleStartAllPending = () => {
    if (stats.pendingCount === 0) return;
    if (window.confirm(`คุณต้องการเริ่มประมูลไอเทมทั้งหมดที่รออยู่จำนวน ${stats.pendingCount} ชิ้นพร้อมกันหรือไม่?`)) {
      startAllPendingAuctions();
    }
  };

  const handleCloseAuctionPrompt = (item: AuctionItem) => {
    const confirmMsg = item.winnerMemberName
      ? `คุณต้องการปิดการประมูล "${item.accessoryName}" ให้กับ "${item.winnerMemberName}" ในราคา ${item.currentPrice.toLocaleString()} หน่วย หรือไม่?`
      : `ยังไม่มีผู้เสนอราคาในรายการ "${item.accessoryName}" คุณต้องการปิดการประมูลตอนนี้หรือไม่?`;

    if (window.confirm(confirmMsg)) {
      closeAuction(item.id);
    }
  };

  const handleDeletePrompt = (item: AuctionItem) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรายการประมูล "${item.accessoryName}"?`)) {
      deleteAuctionItem(item.id);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-6 space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-rose-500/30 bg-white dark:bg-[#0d121f]/95 p-4 sm:p-5 shadow-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-2xl border border-rose-500/40 shadow-sm text-rose-400">
            🏛️
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-wide">
                จัดการประมูลไอเทม (Guild Auction) — {guildName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 border border-rose-500/40 text-rose-700 dark:text-rose-300">
                💎 Accessory Quality = Red (Lv.90)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              เพิ่มรายการของดรอปรอประมูลเป็น List แล้วกดปุ่มเริ่มประมูลทีละชิ้นหรือทั้งหมดเมื่อพร้อม
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
              <span>เริ่มประมูลทั้งหมด ({stats.pendingCount})</span>
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
            <div className="text-[11px] font-semibold text-amber-400/90">รอเริ่มประมูล (Pending)</div>
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
            <div className="text-[11px] font-semibold text-emerald-400/90">กำลังประมูล (Active)</div>
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
            <div className="text-[11px] font-semibold text-indigo-400/90">ปิดการประมูลแล้ว (Ended)</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-300">
              {stats.endedCount} <span className="text-xs font-sans text-slate-400">ชิ้น</span>
            </div>
          </div>
        </div>

        {/* 4. Total Value */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/15 p-3.5 sm:p-4 shadow-sm flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-xl border border-rose-500/40 text-rose-400 shrink-0">
            💰
          </span>
          <div>
            <div className="text-[11px] font-semibold text-rose-400/90">มูลค่ารวมสะสม</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-rose-300">
              {stats.totalValue.toLocaleString()} <span className="text-xs font-sans text-slate-400">หน่วย</span>
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
            <span>⏳ รอเริ่มประมูล</span>
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
            <span>🟢 กำลังประมูล</span>
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
            <span>🏆 จบประมูลแล้ว</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
              {stats.endedCount}
            </span>
          </button>
        </div>

        {/* Search & View Mode Switch */}
        <div className="flex items-center gap-2.5">
          <input
            type="text"
            placeholder="ค้นหาชื่อไอเทม, ผู้ชนะ, หมายเหตุ..."
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
          <span className="text-4xl">🏛️</span>
          <h3 className="text-base font-bold text-slate-300">ไม่พบรายการประมูลที่ตรงกับเงื่อนไข</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {auctionItems.length === 0
              ? 'ยังไม่มีรายการประมูลเครื่องประดับระดับแดงในกิลด์ คลิกปุ่ม "+ เพิ่มของประมูล" ด้านบนเพื่อเพิ่มเป็น List รายการแรก'
              : 'ลองเปลี่ยนคำค้นหาหรือแท็บตัวกรองด้านบนเพื่อดูรายการประมูลอื่นๆ'}
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
                          <span>รอเริ่มประมูล</span>
                        </span>
                      )}
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>กำลังประมูล</span>
                        </span>
                      )}
                      {isEnded && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                          <span>🏆</span>
                          <span>จบแล้ว</span>
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

                {/* Middle: Price & Current Winner Info */}
                <div className="flex items-center gap-4 px-2 md:px-0 self-start md:self-center shrink-0">
                  <div className="text-left md:text-right">
                    <div className="text-[10px] font-semibold text-slate-400">
                      {isPending
                        ? 'ราคาเริ่มต้น (Start):'
                        : isActive
                        ? 'ราคาปัจจุบัน (Current):'
                        : 'ราคาปิดประมูล (Final):'}
                    </div>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-amber-400">
                      {(isEnded ? item.finalPrice || item.currentPrice : item.currentPrice || item.startPrice).toLocaleString()}{' '}
                      <span className="text-xs font-sans text-slate-400 font-normal">หน่วย</span>
                    </div>

                    {/* Winner Info */}
                    {item.winnerMemberName ? (
                      <div className="text-[11px] text-slate-300 flex items-center md:justify-end gap-1.5 mt-0.5">
                        {item.winnerMemberJob && (
                          <JobEmblem job={item.winnerMemberJob} size={18} />
                        )}
                        <span>
                          {isEnded ? 'ผู้ชนะ: ' : 'ผู้นำ: '}
                          <strong className="text-emerald-300">{item.winnerMemberName}</strong>
                        </span>
                      </div>
                    ) : isPending ? (
                      <div className="text-[10px] text-slate-500">พร้อมเปิดให้ประมูล</div>
                    ) : (
                      <div className="text-[10px] text-slate-500">ยังไม่มีผู้เสนอราคา</div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {/* Action 1: START AUCTION (เมื่อเป็น pending) */}
                  {isPending && (
                    <button
                      type="button"
                      onClick={() => handleStartAuction(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>▶️</span>
                      <span>เริ่มประมูล</span>
                    </button>
                  )}

                  {/* Action 2: BID (เมื่อกำลังประมูล active) */}
                  {isActive && (
                    <button
                      type="button"
                      onClick={() => setBiddingAuction(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold shadow-md shadow-amber-950/40 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>💰</span>
                      <span>เสนอราคา</span>
                    </button>
                  )}

                  {/* History Button (for active & ended) */}
                  {!isPending && (
                    <button
                      type="button"
                      onClick={() => setHistoryAuction(item)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      title="ดูประวัติการเคาะราคา"
                    >
                      <span>📋</span>
                      <span className="hidden sm:inline font-mono">({item.bids.length})</span>
                    </button>
                  )}

                  {/* Close Auction Button (for active) */}
                  {isActive && (
                    <button
                      type="button"
                      onClick={() => handleCloseAuctionPrompt(item)}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer"
                      title="ปิดการประมูลนี้"
                    >
                      🔒 ปิดประมูล
                    </button>
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
                        <span>รอเริ่มประมูล</span>
                      </span>
                    ) : isActive ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>กำลังประมูล</span>
                      </span>
                    ) : isEnded ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        <span>🏆</span>
                        <span>จบการประมูลแล้ว</span>
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
                    {isActive && (
                      <button
                        type="button"
                        onClick={() => handleCloseAuctionPrompt(item)}
                        className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[10px] font-bold transition cursor-pointer"
                        title="ปิดการประมูลนี้"
                      >
                        🔒 ปิดประมูล
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeletePrompt(item)}
                      className="text-slate-500 hover:text-rose-400 p-1 text-xs transition cursor-pointer"
                      title="ลบรายการประมูล"
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

                  {/* Price Box */}
                  <div className="p-3 rounded-2xl border border-slate-800 bg-[#080d19]/90 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400">
                        {isPending
                          ? 'ราคาเริ่มต้น (Start Price):'
                          : isActive
                          ? 'ราคาปัจจุบัน (Current Price):'
                          : 'ราคาปิดประมูล (Final Price):'}
                      </span>
                      <span className="text-base sm:text-lg font-extrabold font-mono text-amber-400">
                        {(isEnded ? item.finalPrice || item.currentPrice : item.currentPrice || item.startPrice).toLocaleString()}{' '}
                        <span className="text-xs font-sans text-slate-400 font-normal">หน่วย</span>
                      </span>
                    </div>

                    {/* Winner or Status */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                      <span className="text-slate-400">
                        {isEnded ? 'ผู้ชนะการประมูล:' : 'ผู้เสนอราคาสูงสุด:'}
                      </span>
                      {item.winnerMemberName ? (
                        <span className="flex items-center gap-1.5 font-bold text-white">
                          {item.winnerMemberJob && (
                            <JobEmblem job={item.winnerMemberJob} size={18} />
                          )}
                          <span className="text-emerald-300">{item.winnerMemberName}</span>
                        </span>
                      ) : isPending ? (
                        <span className="text-slate-500 font-medium">รอเริ่มการประมูล</span>
                      ) : (
                        <span className="text-slate-500 font-medium">ยังไม่มีผู้เสนอราคา</span>
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
                      <span>เริ่มประมูลรายการนี้</span>
                    </button>
                  ) : isActive ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setBiddingAuction(item)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold shadow-md shadow-amber-950/40 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <span>💰</span>
                        <span>เสนอราคาประมูล</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHistoryAuction(item)}
                        className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="ดูประวัติการเคาะราคา"
                      >
                        <span>📋</span>
                        <span className="font-mono text-[11px]">({item.bids.length})</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setHistoryAuction(item)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>📋</span>
                      <span>ดูประวัติการประมูล ({item.bids.length} ครั้ง)</span>
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

      <PlaceBidModal
        isOpen={!!biddingAuction}
        onClose={() => setBiddingAuction(null)}
        auction={biddingAuction}
        members={members}
        onConfirmBid={(auctionId, memberId, memberName, memberJob, amount, note) => {
          const res = placeBid(auctionId, memberId, memberName, memberJob, amount, note);
          if (res.success) {
            // Update modal's internal view if still open
            const updated = auctionItems.find((a) => a.id === auctionId);
            if (updated) {
              setBiddingAuction(updated);
            }
          }
        }}
      />

      <BidHistoryModal
        isOpen={!!historyAuction}
        onClose={() => setHistoryAuction(null)}
        auction={historyAuction}
      />
    </div>
  );
}
