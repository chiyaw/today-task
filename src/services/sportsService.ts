import { ContentItem } from '../types/content';

interface SportsApiResponse {
  // Define the expected structure based on the API response
  [key: string]: any;
}

class SportsService {
  private baseURL = 'https://sportapi7.p.rapidapi.com/api/v1/event/13232336/tennis-power';
  private apiKey = '24a1e6429emsh2b56062922407e1p1b40dcjsnb3d71a3bddbc';

  async getSportsData(): Promise<ContentItem[]> {
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': 'sportapi7.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(this.baseURL, options);
      const result = await response.text();
      console.log('Sports API Response:', result);
      
      // Parse the response
      let data;
      try {
        data = JSON.parse(result);
      } catch (parseError) {
        console.error('Failed to parse sports data:', parseError);
        return this.getMockSportsData();
      }

      // Transform the API response to ContentItem format
      return this.transformSportsData(data);
    } catch (error) {
      console.error('Error fetching sports data:', error);
      // Return mock data as fallback
      return this.getMockSportsData();
    }
  }

  private transformSportsData(data: any): ContentItem[] {
    // Transform the API response into ContentItem format
    // Since we don't know the exact structure, we'll create a flexible transformation
    const sportsItems: ContentItem[] = [];

    try {
      // Handle different possible response structures
      const items = Array.isArray(data) ? data : (data.data || data.events || data.results || [data]);
      
      items.slice(0, 20).forEach((item: any, index: number) => {
        const sportsContent: ContentItem = {
          id: `sports-${index}-${Date.now()}`,
          title: item.title || item.name || item.eventName || `Tennis Event ${index + 1}`,
          description: item.description || item.summary || item.details || `Exciting tennis match featuring competitive gameplay and athletic prowess.`,
          image: item.image || item.thumbnail || item.poster || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=400&fit=crop',
          url: item.url || item.link || item.eventUrl || '#',
          type: 'sports' as any, // We'll update the type definition
          category: 'tennis',
          source: item.source || 'SportAPI',
          publishedAt: item.date || item.startTime || item.publishedAt || new Date().toISOString(),
          author: item.author || item.organizer || 'Tennis Organization',
          tags: ['tennis', 'sports', 'match', 'competition'],
          readTime: 3,
          engagement: {
            likes: item.likes || Math.floor(Math.random() * 1000) + 100,
            shares: item.shares || Math.floor(Math.random() * 100) + 10,
            comments: item.comments || Math.floor(Math.random() * 50) + 5,
          }
        };
        
        sportsItems.push(sportsContent);
      });
    } catch (transformError) {
      console.error('Error transforming sports data:', transformError);
      return this.getMockSportsData();
    }

    return sportsItems.length > 0 ? sportsItems : this.getMockSportsData();
  }

  private getMockSportsData(): ContentItem[] {
    // Fallback mock sports data
    return Array.from({ length: 20 }, (_, index) => ({
      id: `mock-sports-${index + 1}`,
      title: `Tennis Championship ${index + 1}`,
      description: `Watch an exciting tennis match featuring world-class players in a thrilling competition. Experience the intensity and skill of professional tennis.`,
      image: `https://images.unsplash.com/photo-${1554068865 + index}-24cecd4e34b8?w=800&h=400&fit=crop`,
      url: '#',
      type: 'sports' as any,
      category: 'tennis',
      source: 'Tennis World',
      publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
      author: 'Sports Reporter',
      tags: ['tennis', 'sports', 'championship', 'competition'],
      readTime: 3,
      engagement: {
        likes: Math.floor(Math.random() * 1000) + 100,
        shares: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 50) + 5,
      }
    }));
  }

  async searchSports(query: string): Promise<ContentItem[]> {
    const allSports = await this.getSportsData();
    return allSports.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}

export const sportsService = new SportsService(); 