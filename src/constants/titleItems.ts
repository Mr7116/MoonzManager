// Title Items (ไอเทม Title) for Auction System
export interface TitleItem {
  id: number;
  name: string;
  nameTh: string;
  category: 'title';
  quality: 'Gold' | 'Purple' | 'Blue' | 'Green';
  qualityBadge: string;
  type: string;
  icon: string;
  localIcon: string;
  remoteIcon: string;
  stats: string[];
}

export const TITLE_ITEMS: TitleItem[] = [
  {
    id: 80001001,
    name: 'Pioneer Certificate',
    nameTh: 'Pioneer Certificate',
    category: 'title',
    quality: 'Gold',
    qualityBadge: 'Title ส้มทอง',
    type: 'ไอเทม Title (เกียรติบัตร)',
    icon: 'pioneer_certificate',
    localIcon: '/images/titles/pioneer_certificate.png',
    remoteIcon: '/images/titles/pioneer_certificate.png',
    stats: ['ไอเทม Title (ระดับส้มทอง)', 'ปลดล็อกฉายาเกียรติยศและสเตตัสตัวละคร'],
  },
  {
    id: 80001002,
    name: 'Adventure Journal',
    nameTh: 'Adventure Journal',
    category: 'title',
    quality: 'Purple',
    qualityBadge: 'Title ม่วง',
    type: 'ไอเทม Title (สมุดบันทึก)',
    icon: 'adventure_journal',
    localIcon: '/images/titles/adventure_journal.png',
    remoteIcon: '/images/titles/adventure_journal.png',
    stats: ['ไอเทม Title (ระดับม่วง)', 'ปลดล็อกฉายาผจญภัยและสเตตัสตัวละคร'],
  },
  {
    id: 80001003,
    name: 'Adventure Scrap',
    nameTh: 'Adventure Scrap',
    category: 'title',
    quality: 'Blue',
    qualityBadge: 'Title ฟ้า',
    type: 'ไอเทม Title (เศษบันทึก)',
    icon: 'adventure_scrap',
    localIcon: '/images/titles/adventure_scrap.png',
    remoteIcon: '/images/titles/adventure_scrap.png',
    stats: ['ไอเทม Title (ระดับฟ้า)', 'ปลดล็อกฉายานักสำรวจและสเตตัสตัวละคร'],
  },
  {
    id: 80001004,
    name: "Traveler's Note",
    nameTh: "Traveler's Note",
    category: 'title',
    quality: 'Green',
    qualityBadge: 'Title เขียว',
    type: 'ไอเทม Title (โน้ตนักเดินทาง)',
    icon: 'travelers_note',
    localIcon: '/images/titles/travelers_note.png',
    remoteIcon: '/images/titles/travelers_note.png',
    stats: ['ไอเทม Title (ระดับเขียว)', 'ปลดล็อกฉายาเริ่มต้นและสเตตัสตัวละคร'],
  },
];
