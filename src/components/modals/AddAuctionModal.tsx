'use client';

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { RED_ACCESSORIES, RedAccessory } from '@/constants/redAccessories';
import { AuctionItem } from '@/types/auction';

interface AddAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: Omit<AuctionItem, 'id' | 'createdAt' | 'currentPrice' | 'bids' | 'status'>) => void;
}

export default function AddAuctionModal({ isOpen, onClose, onConfirm }: AddAuctionModalProps) {
  const [search, setSearch] = useState('');
  const [selectedAccessory, setSelectedAccessory] = useState<RedAccessory | null>(null);

  const [startPrice, setStartPrice] = useState<number>(5000);
  const [minIncrement, setMinIncrement] = useState<number>(500);
  const [sourceNote, setSourceNote] = useState<string>('ดรอปจากกิลด์วอร์ (GVG)');
  const [hasEndDate, setHasEndDate] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 16);
  });

  // Filtered accessories
  const filteredAccessories = useMemo(() => {
    if (!search.trim()) return RED_ACCESSORIES;
    const query = search.trim().toLowerCase();
    return RED_ACCESSORIES.filter((item) => {
      const matchName = item.name.toLowerCase().includes(query);
      const matchStats = item.stats.some((s) => s.toLowerCase().includes(query));
      return matchName || matchStats;
    });
  }, [search]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccessory) {
      alert('กรุณาเลือกเครื่องประดับระดับแดง (Accessory Quality=Red) ที่ต้องการนำมาประมูล');
      return;
    }
    if (startPrice <= 0) {
      alert('กรุณาระบุราคาเริ่มต้นที่มากกว่า 0');
      return;
    }

    onConfirm({
      accessoryId: selectedAccessory.id,
      accessoryName: selectedAccessory.name,
      accessoryLevel: selectedAccessory.level,
      accessoryIcon: selectedAccessory.icon,
      accessoryStats: selectedAccessory.stats,
      startPrice,
      minIncrement: minIncrement > 0 ? minIncrement : 500,
      sourceNote: sourceNote.trim() || undefined,
      endsAt: hasEndDate && endDate ? new Date(endDate).toISOString() : undefined,
    });

    // Reset & Close
    setSelectedAccessory(null);
    setSearch('');
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-rose-500/30 bg-[#0d121f] p-5 sm:p-6 shadow-2xl space-y-5 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/20 text-xl border border-rose-500/40 text-rose-400">
              💎
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-wide flex items-center gap-2">
                <span>เปิดประมูลเครื่องประดับใหม่</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300">
                  Accessory Quality = Red (Lv.90)
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                เลือกเครื่องประดับระดับสีแดง Lv.90 ({RED_ACCESSORIES.length} ชิ้น) และกำหนดราคาเริ่มต้นเพื่อเปิดให้สมาชิกในกิลด์ร่วมประมูล
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 scrollbar-thin">
          {/* Step 1: Select Accessory */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white text-[11px] font-bold">1</span>
                <span>เลือกเครื่องประดับระดับแดง (พบ {filteredAccessories.length} ชิ้น):</span>
              </label>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="ค้นหาชื่อเครื่องประดับ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none w-56 sm:w-72"
                />
              </div>
            </div>

            {/* Accessory Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-56 overflow-y-auto p-2 rounded-2xl border border-slate-800 bg-slate-950/70 scrollbar-thin">
              {filteredAccessories.map((item) => {
                const isSelected = selectedAccessory?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedAccessory(item)}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition cursor-pointer relative group ${
                      isSelected
                        ? 'border-rose-400 bg-rose-950/50 ring-2 ring-rose-500 shadow-lg shadow-rose-500/20'
                        : 'border-slate-800 bg-[#0b101c] hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="relative w-12 h-12 mb-1.5 flex items-center justify-center">
                      <Image
                        src={item.localIcon}
                        alt={item.name}
                        width={44}
                        height={44}
                        unoptimized
                        className="object-contain drop-shadow"
                        onError={(e) => {
                          // Fallback to remote roworlddb image
                          (e.target as HTMLImageElement).src = item.remoteIcon;
                        }}
                      />
                      <span className="absolute bottom-0 right-0 px-1 py-0.2 rounded text-[9px] font-bold bg-black/80 border border-slate-700 text-amber-300 font-mono">
                        Lv.{item.level}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-slate-200 line-clamp-1 w-full" title={item.name}>
                      {item.name}
                    </span>

                    {isSelected && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold shadow">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Item Preview Bar */}
          {selectedAccessory ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/40 to-slate-900/60 shadow-md">
              <div className="relative w-14 h-14 shrink-0 rounded-xl border border-rose-500/50 bg-[#0c1220] flex items-center justify-center shadow-inner">
                <Image
                  src={selectedAccessory.localIcon}
                  alt={selectedAccessory.name}
                  width={48}
                  height={48}
                  unoptimized
                  className="object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = selectedAccessory.remoteIcon;
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                    {selectedAccessory.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                    Lv.{selectedAccessory.level}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    เกรดสีแดง (Quality: Red)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 text-center rounded-xl border border-dashed border-slate-800 text-xs text-slate-500">
              กรุณาคลิกเลือกเครื่องประดับจากรายการด้านบน
            </div>
          )}

          {/* Step 2: Auction Settings */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white text-[11px] font-bold">2</span>
              <span>ตั้งค่าราคาและเงื่อนไขการประมูล:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Start Price */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-300">
                  ราคาเริ่มต้น (Starting Price):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400">💰</span>
                  <input
                    type="number"
                    min="1"
                    step="100"
                    value={startPrice}
                    onChange={(e) => setStartPrice(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-3 py-2 text-xs text-white font-mono font-bold focus:border-rose-500 focus:outline-none"
                    placeholder="5000"
                    required
                  />
                </div>
              </div>

              {/* Min Increment */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-300">
                  ขั้นต่ำการเคาะราคาเพิ่มแต่ละครั้ง (Min Increment):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400">📈</span>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={minIncrement}
                    onChange={(e) => setMinIncrement(Math.max(100, parseInt(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-3 py-2 text-xs text-white font-mono font-bold focus:border-rose-500 focus:outline-none"
                    placeholder="500"
                    required
                  />
                </div>
              </div>

              {/* Source Note */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-300">
                  แหล่งที่มา / หมายเหตุ (Source / Note):
                </label>
                <input
                  type="text"
                  value={sourceNote}
                  onChange={(e) => setSourceNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  placeholder="เช่น ดรอปจาก GVG ปราสาท 1 ประจำสัปดาห์, บอสกิลด์"
                />
              </div>

              {/* Deadline (Optional) */}
              <div className="space-y-1 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hasEndDate}
                      onChange={(e) => setHasEndDate(e.target.checked)}
                      className="rounded border-slate-700 text-rose-600 focus:ring-0 cursor-pointer"
                    />
                    <span>กำหนดเวลาสิ้นสุดการประมูลอัตโนมัติ</span>
                  </label>
                  {!hasEndDate && (
                    <span className="text-[10px] text-slate-500">
                      (ไม่มีกำหนดเวลา — แอดมินสามารถกด &quot;ปิดประมูล&quot; ได้ตลอดเวลา)
                    </span>
                  )}
                </div>

                {hasEndDate && (
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white font-mono focus:border-rose-500 focus:outline-none cursor-pointer mt-1"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={!selectedAccessory}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer"
            >
              <span>🏛️</span>
              <span>เปิดการประมูลไอเทมนี้</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

