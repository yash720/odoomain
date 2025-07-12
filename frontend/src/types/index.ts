export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  points: number;
  isAdmin?: boolean;
  createdAt: Date;
  location?: string;
  bio?: string;
  totalSwaps: number;
  rating: number;
  gender?: string;
  age?: number;
}

export interface ClothingItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  type: string;
  size: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  tags: string[];
  uploaderId: string;
  uploaderName: string;
  uploaderAvatar?: string;
  pointValue: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  views: number;
  likes: number;
  brand?: string;
  originalPrice?: number;
  // Points breakdown fields
  baseCategoryValue?: number;
  itemQualityScore?: number;
  demandWeight?: number;
  conditionBonus?: number;
  trustBoost?: number;
  firstUploadBonus?: number;
  campaignBonus?: number;
  penalties?: number;
  pointsBreakdown?: Record<string, any>;
  totalPointsGiven?: number;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar?: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  offeredItemId?: string;
  offeredItemTitle?: string;
  offeredItemImage?: string;
  pointsOffered?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  message?: string;
  responseMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  type: 'swap' | 'points';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'swap_request' | 'swap_accepted' | 'swap_completed' | 'item_approved' | 'item_rejected' | 'points_earned';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedId?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

export interface ItemFilters {
  searchTerm: string;
  category: string;
  condition: string;
  size: string;
  maxPoints: number | null;
  minPoints: number | null;
  sortBy: string;
  brand: string;
  tags: string[];
}