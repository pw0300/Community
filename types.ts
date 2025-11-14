export type UserRole = 'seeker' | 'provider';
export type ProviderRole = 'guide' | 'partner';
export type CategoryTheme = 'wellness' | 'adventure' | 'business' | 'tech' | 'finance' | 'creative';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  providerDetails?: {
    role: ProviderRole;
    onTimeStartRate: number;
    isTrusted: boolean;
  };
}

export interface Category {
  id: string;
  name: string;
  theme: CategoryTheme;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  imageUrl: string;
  skus: SKU[];
}

export interface SKU {
  id: string;
  name: string;
  description: string;
  subCategoryId: string;
  variants: SkuVariant[];
  communityId: string;
  features: { icon: string; text: string }[];
  stampIcon: string;
}

export interface SkuVariant {
  id: string;
  skuId: string;
  name: string;
  description: string;
  deliveryMode: 'online' | 'offline' | 'mixed';
  format: '1-to-1' | 'group';
  sessionType: 'single' | 'multi';
  price: number;
  cohorts: Cohort[];
}

export interface Cohort {
  id: string;
  skuVariantId: string;
  providerId: string;
  startDateTime: Date;
  endDateTime: Date;
  timeZone: string;
  capacity: number;
  attendees: string[]; // array of user IDs
  location?: string; // for offline/mixed
  meetingUrl?: string; // for online/mixed
  announcements: Announcement[];
  chat: ChatMessage[];
  checklist: ChecklistItem[];
}

export interface Provider {
    id: string;
    name: string;
    avatarUrl: string;
    onTimeStartRate: number;
    isTrusted: boolean;
    rating: number;
    bio: string;
    quote?: string;
    otherSkuIds: string[];
}

export interface Milestone {
    id: string;
    title: string;
    type: 'community' | 'sku';
    description: string;
    skuId?: string; // only for sku type
    isPrerequisite?: boolean;
}

export interface Community {
    id: string;
    name: string;
    description: string;
    coverImageUrl: string;
    type: 'club' | 'guild';
    members: string[]; // array of user IDs
    posts: CommunityPost[];
    activeNow: number;
    weeklyGrowth: number;
    journeyMap?: Milestone[];
}

export interface CommunityPost {
    id: string;
    authorId: string;
    content: string;
    timestamp: Date;
    photos?: string[];
    isAiAgentPost?: boolean;
    postType: 'prompt' | 'poll' | 'spotlight' | 'challenge';
    pollOptions?: string[];
    likes: number;
    comments: { authorId: string; text: string; timestamp: Date }[];
}

export interface AddOn {
    id: string;
    name: string;
    price: number;
}

export interface Booking {
    id: string;
    userId: string;
    cohortId: string;
    bookingDate: Date;
    status: 'confirmed' | 'waitlisted' | 'completed' | 'cancelled';
}

export interface Announcement {
    id: string;
    content: string;
    timestamp: Date;
}

export interface ChatMessage {
    id: string;
    authorId: string;
    content: string;
    timestamp: Date;
}

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}