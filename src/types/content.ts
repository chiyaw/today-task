export interface ContentItem {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'news' | 'entertainment' | 'social' | 'sports' | 'educational' | 'travel' | 'finance' | 'technology';
  category: string;
  source: string;
  publishedAt: string;
  author?: string;
  tags: string[];
  readTime?: number;
  rating?: number;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface NewsItem extends ContentItem {
  type: 'news';
  category: string;
  source: string;
}

export interface EntertainmentItem extends ContentItem {
  type: 'entertainment';
  genre: string[];
  rating: number;
  releaseDate: string;
  cast?: string[];
}

export interface SocialItem extends ContentItem {
  type: 'social';
  platform: string;
  hashtags: string[];
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface SportsItem extends ContentItem {
  type: 'sports';
  sport: string;
  league?: string;
  teams?: string[];
  venue?: string;
  eventDate?: string;
}

export interface EducationalItem extends ContentItem {
  type: 'educational';
  subject: string;
  level?: string;
  institution?: string;
}

export interface TravelItem extends ContentItem {
  type: 'travel';
  destination: string;
  country?: string;
  travelType?: string;
  duration?: string;
}

export interface FinanceItem extends ContentItem {
  type: 'finance';
  marketSector?: string;
  assetClass?: string;
  priceTarget?: number;
}

export interface TechnologyItem extends ContentItem {
  type: 'technology';
  techCategory: string;
  platform?: string;
  version?: string;
}