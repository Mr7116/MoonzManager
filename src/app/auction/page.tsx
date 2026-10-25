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
    addAuctionItem,
    placeBid,
    closeAuction,
    deleteAuctionItem,
    saveToCloud,
    isSaving,
  } = useGuildStore();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'ended'>('all');
  const [search, setSearch] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [biddingAuction, setBiddingAuction] = useState<AuctionItem | null>(null);
  const [historyAuction, setHistoryAuction] = useState<AuctionItem | null>(null);

  // Filtered items
  const filteredItems = useMemo(() => {
    return auctionItems.filter((item) => {
      if (activeTab === 'active' && item.status !== 'active') return false;
      if (activeTab === 'ended' && item.status !== 'ended') return false;

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchName = item.accessoryName.toLowerCase().includes(q);
        const matchWinner = item.winnerMemberName?.toLowerCase().includes(q);
        const matchSource = item.sourceNote?.toLowerCase().includes(q);
        const matchStats = item.accessoryStats.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchWinner && !matchSource && !matchStats) return false;
      }
      return true;
    });
  }, [auctionItems, activeTab, search]);

  // Statistics
  const stats = useMemo(() => {
    const activeCount = auctionItems.filter((a) => a.status === 'active').length;
    const endedCount = auctionItems.filter((a) => a.status === 'ended').length;
    const totalBidsCount = auctionItems.reduce((sum, a) => sum + (a.bids?.length || 0), 0);
    const totalValue = auctionItems.reduce((sum, a) => sum + (a.currentPrice || a.startPrice || 0), 0);

    return {
      activeCount,
      endedCount,
      totalBidsCount,
      totalValue,
    };
  }, [auctionItems]);

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
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-6 space-y-6">
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
                💎 Accessory Quality = Red
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ระบบเปิดประมูลเครื่องประดับระดับแดงที่ดรอปจากกิลด์วอร์และกิจกรรมสำหรับสมาชิกกิลด์
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <AutoSaveBadge />

          <button
            type="button"
            onClick={saveToCloud}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-400 dark:border-indigo-500/50 bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-sm cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <span>💾</span>
            <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึก Cloud'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/25 transition cursor-pointer whitespace-nowrap active:scale-95"
          >
            <span className="text-base font-extrabold">+</span>
            <span>เพิ่มของประมูล (Add Item)</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Active */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-4 shadow-sm flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-xl border border-emerald-500/40 text-emerald-400 shrink-0">
            🟢
          </span>
          <div>
            <div className="text-[11px] font-semibold text-emerald-400/90">กำลังเปิดประมูล (Active)</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-300">
              {stats.activeCount} <span className="text-xs font-sans text-slate-400">ชิ้น</span>
            </div>
          </div>
        </div>

        {/* 2. Ended */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-4 shadow-sm flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-xl border border-amber-500/40 text-amber-400 shrink-0">
            🏆
          </span>
          <div>
            <div className="text-[11px] font-semibold text-amber-400/90">ปิดการประมูลแล้ว (Ended)</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-300">
              {stats.endedCount} <span className="text-xs font-sans text-slate-400">ชิ้น</span>
            </div>
          </div>
        </div>

        {/* 3. Total Value */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/15 p-4 shadow-sm flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-xl border border-rose-500/40 text-rose-400 shrink-0">
            💰
          </span>
          <div>
            <div className="text-[11px] font-semibold text-rose-400/90">มูลค่าการประมูลรวม</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-rose-300">
              {stats.totalValue.toLocaleString()} <span className="text-xs font-sans text-slate-400">หน่วย</span>
            </div>
          </div>
        </div>

        {/* 4. Total Bids */}
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/15 p-4 shadow-sm flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-xl border border-indigo-500/40 text-indigo-400 shrink-0">
            👥
          </span>
          <div>
            <div className="text-[11px] font-semibold text-indigo-400/90">ยอดเคาะราคาสะสม (Bids)</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-300">
              {stats.totalBidsCount} <span className="text-xs font-sans text-slate-400">ครั้ง</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d121f] p-3 shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ทั้งหมด ({auctionItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'ended'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
          >
            <span>🏆 จบประมูลแล้ว</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
              {stats.endedCount}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="ค้นหาชื่อไอเทม, ผู้ชนะ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-rose-500 focus:outline-none w-56 sm:w-72"
          />
        </div>
      </div>

      {/* Auction Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center space-y-3">
          <span className="text-4xl">🏛️</span>
          <h3 className="text-base font-bold text-slate-300">ไม่พบรายการประมูลที่ตรงกับเงื่อนไข</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {auctionItems.length === 0
              ? 'ยังไม่มีรายการประมูลเครื่องประดับระดับแดงในกิลด์ คลิกปุ่ม "เพิ่มของประมูล" ด้านบนเพื่อเริ่มรายการแรก'
              : 'ลองเปลี่ยนคำค้นหาหรือตัวกรองด้านบนเพื่อดูรายการประมูลอื่นๆ'}
          </p>
          {auctionItems.length === 0 && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white transition shadow cursor-pointer"
            >
              <span>+ เพิ่มของประมูลชิ้นแรก</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isActive = item.status === 'active';
            const isEnded = item.status === 'ended';

            return (
              <div
                key={item.id}
                className={`rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition-all shadow-md relative overflow-hidden group ${
                  isActive
                    ? 'border-rose-500/30 bg-[#0d121f] hover:border-rose-500/60 hover:shadow-rose-500/10'
                    : 'border-slate-800 bg-[#0a0e18]/80 opacity-90'
                }`}
              >
                {/* Top: Status Badge + Delete Button */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
                  <div className="flex items-center gap-1.5">
                    {isActive ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>กำลังประมูล</span>
                      </span>
                    ) : isEnded ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <span>🏆</span>
                        <span>จบการประมูลแล้ว</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        ยกเลิก
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                      Red Grade
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

                {/* Middle: Accessory Details */}
                <div className="py-3.5 space-y-3 flex-1">
                  <div className="flex items-start gap-3">
                    {/* Item Image with Red Glow */}
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
                        {isActive ? 'ราคาปัจจุบัน (Current Price):' : 'ราคาปิดประมูล (Final Price):'}
                      </span>
                      <span className="text-lg font-black font-mono text-amber-400">
                        {item.currentPrice.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-slate-400">หน่วย</span>
                      </span>
                    </div>

                    {/* Highest Bidder or Winner */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                      <span className="text-slate-400 flex items-center gap-1">
                        <span>{isActive ? '👑 ผู้นำการเสนอราคา:' : '🏆 ผู้ชนะการประมูล:'}</span>
                      </span>

                      {item.winnerMemberName ? (
                        <span className="flex items-center gap-1.5 font-bold text-white">
                          <JobEmblem job={item.winnerMemberJob} size={18} />
                          <span>{item.winnerMemberName}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">ยังไม่มีผู้เสนอราคา</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom: Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  {/* View History Button */}
                  <button
                    type="button"
                    onClick={() => setHistoryAuction(item)}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>📜</span>
                    <span>ประวัติ ({item.bids.length})</span>
                  </button>

                  {/* Bid Button (Active only) */}
                  {isActive && (
                    <button
                      type="button"
                      onClick={() => setBiddingAuction(item)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
                    >
                      <span>🔨</span>
                      <span>เสนอราคา</span>
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
        onConfirm={addAuctionItem}
      />

      <PlaceBidModal
        isOpen={!!biddingAuction}
        onClose={() => setBiddingAuction(null)}
        auction={biddingAuction}
        members={members}
        onConfirmBid={placeBid}
      />

      <BidHistoryModal
        isOpen={!!historyAuction}
        onClose={() => setHistoryAuction(null)}
        auction={historyAuction}
      />
    </div>
  );
}

