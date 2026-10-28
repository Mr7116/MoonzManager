/**
 * ============================================================
 * Global Guild Configuration (ตั้งค่า ID กิลด์หลัก)
 * ============================================================
 * คุณสามารถเปลี่ยนเลข GUILD_ID ที่นี่ที่เดียว (เช่น เปลี่ยนเป็น 2)
 * หรือตั้งผ่าน environment variable: NEXT_PUBLIC_GUILD_ID=2
 * 
 * ทุกหน้า ทุกตาราง และระบบ Realtime ทั้งหมดจะเปลี่ยนไปใช้ ID นี้ทันที!
 */

export const DEFAULT_GUILD_ID = 1;

export const GUILD_ID: number = (() => {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_GUILD_ID) {
    const parsed = Number(process.env.NEXT_PUBLIC_GUILD_ID);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  // เปลี่ยนเลข ID เริ่มต้นตรงนี้ได้เลย (เช่น เปลี่ยน 1 เป็น 2)
  return 1;
})();

