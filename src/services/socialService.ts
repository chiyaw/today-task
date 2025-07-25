import { ContentItem } from '../types/content';

// Mock social media data
const mockSocialData = [
  {
    id: 'social-1',
    title: 'The future of AI is here! 🚀',
    description: 'Just witnessed an amazing demonstration of GPT-4\'s capabilities in creative writing. The possibilities are endless! #AI #Technology #Innovation',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    url: 'https://example.com/ai-post',
    type: 'social' as const,
    category: 'technology',
    source: 'TwitterMock',
    publishedAt: new Date().toISOString(),
    author: '@TechEnthusiast',
    tags: ['AI', 'technology', 'innovation'],
    platform: 'Twitter',
    hashtags: ['AI', 'Technology', 'Innovation'],
    engagement: {
      likes: 1234,
      shares: 89,
      comments: 156,
    },
  },
  {
    id: 'social-2',
    title: 'Beautiful sunset from my balcony today 🌅',
    description: 'Sometimes you need to pause and appreciate the simple beauty around us. Nature never fails to amaze! #Photography #Sunset #Nature',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    url: 'https://example.com/sunset-post',
    type: 'social' as const,
    category: 'lifestyle',
    source: 'InstagramMock',
    publishedAt: new Date(Date.now() - 1800000).toISOString(),
    author: '@NatureLovers',
    tags: ['photography', 'sunset', 'nature'],
    platform: 'Instagram',
    hashtags: ['Photography', 'Sunset', 'Nature'],
    engagement: {
      likes: 2456,
      shares: 234,
      comments: 89,
    },
  },
  {
    id: 'social-3',
    title: 'New design system launched! 🎨',
    description: 'Excited to share our latest design system that focuses on accessibility and user experience. Check out the component library! #Design #UX #WebDev',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
    url: 'https://example.com/design-post',
    type: 'social' as const,
    category: 'design',
    source: 'LinkedInMock',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    author: '@DesignTeam',
    tags: ['design', 'UX', 'webdev'],
    platform: 'LinkedIn',
    hashtags: ['Design', 'UX', 'WebDev'],
    engagement: {
      likes: 567,
      shares: 123,
      comments: 45,
    },
  },
  {
    id: 'social-4',
    title: 'Coffee and code - perfect morning combo ☕',
    description: 'Starting the day with a fresh cup of coffee and some clean code. There\'s something magical about the morning coding session! #Developer #Coffee #Code',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    url: 'https://example.com/coffee-code-post',
    type: 'social' as const,
    category: 'technology',
    source: 'TwitterMock',
    publishedAt: new Date(Date.now() - 5400000).toISOString(),
    author: '@CodeCoffeeDev',
    tags: ['developer', 'coffee', 'programming'],
    platform: 'Twitter',
    hashtags: ['Developer', 'Coffee', 'Code'],
    engagement: {
      likes: 892,
      shares: 67,
      comments: 34,
    },
  },
];

class SocialService {
  async getSocialPosts(hashtags: string[]): Promise<ContentItem[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter mock data based on hashtags
      const filtered = mockSocialData.filter(post =>
        hashtags.some(hashtag =>
          post.hashtags.some(tag => tag.toLowerCase().includes(hashtag.toLowerCase())) ||
          post.tags.some(tag => tag.toLowerCase().includes(hashtag.toLowerCase()))
        )
      );

      return filtered.length > 0 ? filtered : mockSocialData;
    } catch (error) {
      console.error('Error fetching social posts:', error);
      return mockSocialData;
    }
  }

  async searchSocialPosts(query: string): Promise<ContentItem[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const filtered = mockSocialData.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.description.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        post.hashtags.some(hashtag => hashtag.toLowerCase().includes(query.toLowerCase()))
      );

      return filtered;
    } catch (error) {
      console.error('Error searching social posts:', error);
      return [];
    }
  }

  async getTrendingPosts(): Promise<ContentItem[]> {
    try {
      // Return posts sorted by engagement
      const sorted = [...mockSocialData].sort((a, b) => 
        (b.engagement.likes + b.engagement.shares) - (a.engagement.likes + a.engagement.shares)
      );

      return sorted;
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      return mockSocialData;
    }
  }

  async getPostsByPlatform(platform: string): Promise<ContentItem[]> {
    try {
      const filtered = mockSocialData.filter(post => 
        post.platform.toLowerCase() === platform.toLowerCase()
      );

      return filtered;
    } catch (error) {
      console.error(`Error fetching ${platform} posts:`, error);
      return [];
    }
  }
}

export const socialService = new SocialService();