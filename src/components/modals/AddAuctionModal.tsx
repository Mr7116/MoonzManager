'use client';

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { RED_ACCESSORIES, RedAccessory } from '@/constants/redAccessories';
import { AuctionItem } from '@/types/auction';

interface SelectedEntry {
  accessory: RedAccessory;
  count: number;
}

interface AddAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    items: Array<Omit<AuctionItem, 'id' | 'createdAt' | 'currentPrice' | 'bids' | 'status' | 'entries'> & { status?: 'pending' | 'active' }>
  ) => void;
}

export default function AddAuctionModal({ isOpen, onClose, onConfirm }: AddAuctionModalProps) {
  const [search, setSearch] = useState('');
  const [sourceNote, setSourceNote] = useState<string>('ดรอปจากกิลด์วอร์ (GVG)');
  const [selectedMap, setSelectedMap] = useState<Record<number, SelectedEntry>>({});

  // Filtered accessories
  const filteredAccessories = useMemo(() => {
    if (!search.trim()) return RED_ACCESSORIES;
    const query = search.trim().toLowerCase();
    return RED_ACCESSORIES.filter((item) => {
      return item.name.toLowerCase().includes(query);
    });
  }, [search]);

  // Selected entries array
  const selectedEntries = useMemo(() => Object.values(selectedMap), [selectedMap]);

  const totalItemCount = useMemo(() => {
    return selectedEntries.reduce((sum, entry) => sum + entry.count, 0);
  }, [selectedEntries]);

  if (!isOpen) return null;

  const handleToggleItem = (acc: RedAccessory) => {
    setSelectedMap((prev) => {
      const existing = prev[acc.id];
      if (existing) {
        return {
          ...prev,
          [acc.id]: {
            ...existing,
            count: existing.count + 1,
          },
        };
      } else {
        return {
          ...prev,
          [acc.id]: {
            accessory: acc,
            count: 1,
          },
        };
      }
    });
  };

  const handleUpdateCount = (accId: number, delta: number) => {
    setSelectedMap((prev) => {
      const existing = prev[accId];
      if (!existing) return prev;
      const newCount = existing.count + delta;
      if (newCount <= 0) {
        const copy = { ...prev };
        delete copy[accId];
        return copy;
      }
      return {
        ...prev,
        [accId]: { ...existing, count: newCount },
      };
    });
  };

  const handleRemoveItem = (accId: number) => {
    setSelectedMap((prev) => {
      const copy = { ...prev };
      delete copy[accId];
      return copy;
    });
  };

  const handleClearAll = () => {
    setSelectedMap({});
  };

  const handleSubmit = (status: 'pending' | 'active') => {
    if (selectedEntries.length === 0) {
      alert('กรุณาคลิกเลือกเครื่องประดับอย่างน้อย 1 ชิ้นเพื่อเพิ่มเข้าสู่รายการ');
      return;
    }

    const itemsToCreate: Array<
      Omit<AuctionItem, 'id' | 'createdAt' | 'currentPrice' | 'bids' | 'status' | 'entries'> & { status?: 'pending' | 'active' }
    > = [];

    for (const entry of selectedEntries) {
      for (let i = 0; i < entry.count; i++) {
        itemsToCreate.push({
          accessoryId: entry.accessory.id,
          accessoryName: entry.accessory.name,
          accessoryLevel: entry.accessory.level,
          accessoryIcon: entry.accessory.icon,
          accessoryStats: entry.accessory.stats || [],
          startPrice: 0,
          minIncrement: 0,
          sourceNote: sourceNote.trim() || undefined,
          status,
        });
      }
    }

    onConfirm(itemsToCreate);

    // Reset & Close
    setSelectedMap({});
    setSearch('');
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-rose-500/30 bg-[#0d121f] p-5 sm:p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/20 text-xl border border-rose-500/40 text-rose-400">
              💎
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-wide flex items-center gap-2">
                <span>เพิ่มรายการของดรอปเพื่อเปิดสุ่ม (Add Drop Items)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300">
                  Lv.90 Red
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                คลิกเลือกเครื่องประดับเพื่อเพิ่มเป็น List รายการให้สมาชิกกิลด์ส่งรายชื่อเข้ามาสุ่มด้วยวงล้อ
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

        {/* Source Note Bar */}
        <div className="p-3 rounded-2xl border border-slate-800 bg-slate-950/60 shrink-0 text-xs">
          <label className="text-slate-400 block mb-1 font-semibold">แหล่งที่มา / หมายเหตุ (Source):</label>
          <input
            type="text"
            value={sourceNote}
            onChange={(e) => setSourceNote(e.target.value)}
            placeholder="เช่น ดรอปจาก GVG รอบวันอาทิตย์ / Siege War"
            className="w-full rounded-xl border border-slate-700 bg-[#080d1a] px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
          />
        </div>

        {/* Middle Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {/* Step 1: Accessory Selector Grid */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white text-[11px] font-bold">1</span>
                <span>คลิกเลือกเครื่องประดับ (พบ {filteredAccessories.length} ชิ้น):</span>
              </label>

              <input
                type="text"
                placeholder="ค้นหาชื่อเครื่องประดับ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none w-56 sm:w-64"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 max-h-48 overflow-y-auto p-2 rounded-2xl border border-slate-800 bg-slate-950/70 scrollbar-thin">
              {filteredAccessories.map((item) => {
                const entry = selectedMap[item.id];
                const isSelected = !!entry;
                const count = entry?.count || 0;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleItem(item)}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition cursor-pointer relative group ${
                      isSelected
                        ? 'border-rose-400 bg-rose-950/40 ring-1 ring-rose-500 shadow-md shadow-rose-500/20'
                        : 'border-slate-800 bg-[#0b101c] hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="relative w-12 h-12 mb-1 flex items-center justify-center">
                      <Image
                        src={item.localIcon}
                        alt={item.name}
                        width={44}
                        height={44}
                        unoptimized
                        className="object-contain drop-shadow"
                        onError={(e) => {
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
                      <span className="absolute top-1 right-1 flex items-center justify-center px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow">
                        x{count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Selected Items List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-bold">2</span>
                <span>รายการไอเทมที่จะเพิ่มเข้าสู่ List ({totalItemCount} ชิ้น):</span>
              </label>
              {selectedEntries.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer"
                >
                  ล้างรายการทั้งหมด
                </button>
              )}
            </div>

            {selectedEntries.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-xs text-slate-500 space-y-1">
                <p className="text-sm text-slate-400 font-semibold">ยังไม่มีเครื่องประดับในรายการ</p>
                <p>คลิกที่ไอคอนเครื่องประดับด้านบนเพื่อเพิ่มเข้าสู่ List รายการเตรียมเปิดสุ่ม</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {selectedEntries.map((entry) => (
                  <div
                    key={entry.accessory.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl border border-slate-800 bg-[#090d18] hover:border-slate-700 transition"
                  >
                    {/* Item Thumbnail & Name */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 shrink-0 rounded-xl border border-rose-500/30 bg-[#0d121f] flex items-center justify-center">
                        <Image
                          src={entry.accessory.localIcon}
                          alt={entry.accessory.name}
                          width={36}
                          height={36}
                          unoptimized
                          className="object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = entry.accessory.remoteIcon;
                          }}
                        />
                        <span className="absolute bottom-0 right-0 px-1 py-0.2 rounded text-[8px] font-bold bg-black/80 border border-slate-700 text-amber-300 font-mono">
                          Lv.{entry.accessory.level}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-white">{entry.accessory.name}</h4>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Red
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper & Remove */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-slate-950 rounded-xl border border-slate-700 p-0.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateCount(entry.accessory.id, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center transition cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-white">
                          {entry.count}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCount(entry.accessory.id, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(entry.accessory.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 text-sm transition cursor-pointer"
                        title="ลบชิ้นนี้ออกจากรายการ"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 shrink-0">
          <div className="text-xs text-slate-400">
            รวมทั้งหมด:{' '}
            <strong className="text-white font-mono text-sm">{totalItemCount}</strong> ชิ้น
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-300 transition cursor-pointer"
            >
              ยกเลิก
            </button>

            {/* Action 1: Add as Pending List (รอเปิดสุ่ม) */}
            <button
              type="button"
              disabled={totalItemCount === 0}
              onClick={() => handleSubmit('pending')}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-amber-900/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>📋</span>
              <span>เพิ่มเป็นรายการรอเปิดสุ่ม ({totalItemCount})</span>
            </button>

            {/* Action 2: Add and Start Immediately */}
            <button
              type="button"
              disabled={totalItemCount === 0}
              onClick={() => handleSubmit('active')}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>▶️</span>
              <span>เปิดรับรายชื่อทันที</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
