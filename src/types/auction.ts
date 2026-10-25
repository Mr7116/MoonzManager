export interface BidRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberJob?: string;
  amount: number;
  timestamp: string; // ISO String
  note?: string;
}

export interface AuctionItem {
  id: string;
  accessoryId: number;
  accessoryName: string;
  accessoryLevel?: number;
  accessoryIcon: string;
  accessoryStats: string[];

  // Price & Settings
  startPrice: number;
  minIncrement: number;
  currentPrice: number;

  status: 'pending' | 'active' | 'ended' | 'cancelled';

  // Winner Information
  winnerMemberId?: string;
  winnerMemberName?: string;
  winnerMemberJob?: string;
  finalPrice?: number;

  // Metadata
  sourceNote?: string;
  createdAt: string;
  startedAt?: string;
  endsAt?: string;
  closedAt?: string;

  // Bids
  bids: BidRecord[];
}

