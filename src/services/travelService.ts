import { ContentItem } from '../types/content';

class TravelService {
  private baseURL = 'https://52-in-kicks.p.rapidapi.com/test';
  private apiKey = '24a1e6429emsh2b56062922407e1p1b40dcjsnb3d71a3bddbc';

  async getTravelData(): Promise<ContentItem[]> {
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': '52-in-kicks.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(this.baseURL, options);
      const result = await response.text();
      console.log('Travel API Response:', result);
      
      let data;
      try {
        data = JSON.parse(result);
      } catch (parseError) {
        console.error('Failed to parse travel data:', parseError);
        return this.getMockTravelData();
      }

      return this.transformTravelData(data);
    } catch (error) {
      console.error('Error fetching travel data:', error);
      return this.getMockTravelData();
    }
  }

  private transformTravelData(data: any): ContentItem[] {
    const travelItems: ContentItem[] = [];

    try {
      const items = Array.isArray(data) ? data : (data.data || data.destinations || data.places || [data]);
      
      // Generate 20 travel items
      for (let i = 0; i < 20; i++) {
        const item = items[i % Math.max(items.length, 1)] || {};
        const travelContent: ContentItem = {
          id: `travel-${i}-${Date.now()}`,
          title: item.title || item.name || item.destination || `Amazing Travel Destination ${i + 1}`,
          description: item.description || item.summary || item.details || `Discover breathtaking destinations and travel experiences. Explore hidden gems, cultural treasures, and adventure opportunities around the world.`,
          image: item.image || item.photo || `https://images.unsplash.com/photo-${1506905925173 + i}-c02ee6007696?w=800&h=400&fit=crop`,
          url: item.url || item.link || '#',
          type: 'travel' as any,
          category: 'destinations',
          source: item.source || '52 in Kicks',
          publishedAt: item.date || new Date(Date.now() - i * 3600000).toISOString(),
          author: item.author || 'Travel Guide',
          tags: ['travel', 'destinations', 'adventure', 'explore'],
          readTime: 6,
          engagement: {
            likes: item.likes || Math.floor(Math.random() * 600) + 150,
            shares: item.shares || Math.floor(Math.random() * 120) + 30,
            comments: item.comments || Math.floor(Math.random() * 80) + 20,
          }
        };
        
        travelItems.push(travelContent);
      }
    } catch (transformError) {
      console.error('Error transforming travel data:', transformError);
      return this.getMockTravelData();
    }

    return travelItems.length > 0 ? travelItems : this.getMockTravelData();
  }

  private getMockTravelData(): ContentItem[] {
    const destinations = [
      { name: "Santorini, Greece", desc: "Stunning white-washed buildings overlooking the Aegean Sea" },
      { name: "Kyoto, Japan", desc: "Ancient temples and traditional gardens in Japan's cultural heart" },
      { name: "Banff National Park, Canada", desc: "Majestic mountain landscapes and pristine wilderness" },
      { name: "Machu Picchu, Peru", desc: "Ancient Incan citadel high in the Andes Mountains" },
      { name: "Safari in Kenya", desc: "Wildlife adventures in the heart of Africa" },
      { name: "Northern Lights, Iceland", desc: "Magical aurora borealis dancing across the sky" },
      { name: "Bali, Indonesia", desc: "Tropical paradise with rice terraces and spiritual culture" },
      { name: "Swiss Alps", desc: "Snow-capped peaks and charming mountain villages" },
      { name: "Great Barrier Reef, Australia", desc: "Underwater wonderland teeming with marine life" },
      { name: "Tuscany, Italy", desc: "Rolling hills, vineyards, and Renaissance art" }
    ];

    return Array.from({ length: 20 }, (_, index) => ({
      id: `mock-travel-${index + 1}`,
      title: destinations[index % destinations.length].name,
      description: destinations[index % destinations.length].desc + ". Plan your next adventure and create unforgettable memories.",
      image: `https://images.unsplash.com/photo-1506905925173-c02ee6007696?w=800&h=400&fit=crop`,
      url: '#',
      type: 'travel' as any,
      category: 'destinations',
      source: 'Travel Explorer',
      publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
      author: 'Travel Guide',
      tags: ['travel', 'destinations', 'adventure', 'explore'],
      readTime: 6,
      engagement: {
        likes: Math.floor(Math.random() * 600) + 150,
        shares: Math.floor(Math.random() * 120) + 30,
        comments: Math.floor(Math.random() * 80) + 20,
      }
    }));
  }

  async searchTravel(query: string): Promise<ContentItem[]> {
    const allTravel = await this.getTravelData();
    return allTravel.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}

export const travelService = new TravelService(); 