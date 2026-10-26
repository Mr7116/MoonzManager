// Title Items (ไอเทม Title) for Auction System
// Official icons from roworlddb: icon_item_touxian_01 to 05
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
    id: 18415001,
    name: 'Pioneer Certificate',
    nameTh: 'Pioneer Certificate',
    category: 'title',
    quality: 'Gold',
    qualityBadge: 'Title ส้มทอง',
    type: 'ไอเทม Title (เกียรติบัตร)',
    icon: 'icon_item_touxian_04',
    localIcon: '/images/titles/icon_item_touxian_04.webp',
    remoteIcon: 'https://roworlddb.com/media/images/item/icon_item_touxian_04.webp',
    stats: [
      'ตราสัญลักษณ์ Trailblazer ที่ออกโดยสมาคม Kafra',
      'ของหายากและล้ำค่า ใช้ Promote Title ของ Trailblazer',
      'ย่อยสลายได้เป็นบันทึกการผจญภัย 4 ชิ้น',
    ],
  },
  {
    id: 18414001,
    name: 'Adventure Journal',
    nameTh: 'Adventure Journal',
    category: 'title',
    quality: 'Purple',
    qualityBadge: 'Title ม่วง',
    type: 'ไอเทม Title (สมุดบันทึก)',
    icon: 'icon_item_touxian_03',
    localIcon: '/images/titles/icon_item_touxian_03.webp',
    remoteIcon: 'https://roworlddb.com/media/images/item/icon_item_touxian_03.webp',
    stats: [
      'สมุดบันทึกข้อมูลการผจญภัยระดับสูง',
      'ใช้สำหรับ Level Up Title หรือ Promote Title',
      'ย่อยสลายได้เป็นเศษบันทึกการผจญภัย 4 ชิ้น',
    ],
  },
  {
    id: 18413001,
    name: 'Adventure Scrap',
    nameTh: 'Adventure Scrap',
    category: 'title',
    quality: 'Blue',
    qualityBadge: 'Title ฟ้า',
    type: 'ไอเทม Title (เศษบันทึก)',
    icon: 'icon_item_touxian_02',
    localIcon: '/images/titles/icon_item_touxian_02.webp',
    remoteIcon: 'https://roworlddb.com/media/images/item/icon_item_touxian_02.webp',
    stats: [
      'ข้อมูลล้ำค่าที่บันทึกไว้ระหว่างการผจญภัย',
      'ใช้สำหรับ Level Up Title หรือผสมผสานเป็นไอเทม Title ระดับสูงขึ้น',
      'ย่อยสลายได้เป็นบันทึกนักเดินทาง 4 ชิ้น',
    ],
  },
  {
    id: 18412001,
    name: "Traveler's Note",
    nameTh: "Traveler's Note",
    category: 'title',
    quality: 'Green',
    qualityBadge: 'Title เขียว',
    type: 'ไอเทม Title (โน้ตนักเดินทาง)',
    icon: 'icon_item_touxian_01',
    localIcon: '/images/titles/icon_item_touxian_01.webp',
    remoteIcon: 'https://roworlddb.com/media/images/item/icon_item_touxian_01.webp',
    stats: [
      'บันทึกย่อที่จดไว้ระหว่างเดินทาง',
      'ใช้สำหรับ Level Up Title หรือผสมผสานเป็นไอเทม Title ระดับสูงขึ้น',
    ],
  },
  {
    id: 18419001,
    name: 'Eden Seal',
    nameTh: 'Eden Seal',
    category: 'title',
    quality: 'Purple',
    qualityBadge: 'Title พิเศษ',
    type: 'ไอเทม Title (ตราประทับ)',
    icon: 'icon_item_touxian_05',
    localIcon: '/images/titles/icon_item_touxian_05.webp',
    remoteIcon: 'https://roworlddb.com/media/images/item/icon_item_touxian_05.webp',
    stats: [
      'Eden Seal ตราประทับกิลด์อีเดน',
      'เป็นไอเทมที่ขาดไม่ได้สำหรับการผสมผสานไอเทม Title',
    ],
  },
];
