import { ContentItem } from '../types/content';

class EntertainmentServiceRapi {
  private baseURL = 'https://www.tvmaze.com/api';
  private apiKey = 'https://api.tvmaze.com/search/shows?q=how%20i%20met%20your%20mother';

  async getEntertainmentData(): Promise<ContentItem[]> {
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': 'fun-facts1.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(this.baseURL, options);
      const result = await response.text();
      console.log('Entertainment API Response:', result);
      
      let data;
      try {
        data = JSON.parse(result);
      } catch (parseError) {
        console.error('Failed to parse entertainment data:', parseError);
        return this.getMockEntertainmentData();
      }

      return this.transformEntertainmentData(data);
    } catch (error) {
      console.error('Error fetching entertainment data:', error);
      return this.getMockEntertainmentData();
    }
  }

  private transformEntertainmentData(data: any): ContentItem[] {
    const entertainmentItems: ContentItem[] = [];

    try {
      const items = Array.isArray(data) ? data : (data.data || data.facts || data.funFacts || [data]);
      
      // Generate 20 items from the available data
      for (let i = 0; i < 20; i++) {
        const item = items[i % items.length] || {};
        const entertainmentContent: ContentItem = {
          id: `entertainment-${i}-${Date.now()}`,
          title: item.title || item.fact || item.text || `Amazing Fun Fact #${i + 1}`,
          description: item.description || item.detail || item.explanation || item.text || `Discover fascinating and entertaining facts that will amaze you! These fun facts cover a wide range of topics from science to history to everyday life.`,
          image: item.image,
          url: item.url || item.link || '#',
          type: 'entertainment',
          category: 'fun-facts',
          source: item.source || 'Fun Facts',
          publishedAt: item.date || new Date(Date.now() - i * 3600000).toISOString(),
          author: item.author || 'Fun Facts Team',
          tags: ['fun-facts', 'entertainment', 'trivia', 'amazing'],
          readTime: 2,
          engagement: {
            likes: item.likes || Math.floor(Math.random() * 800) + 200,
            shares: item.shares || Math.floor(Math.random() * 150) + 50,
            comments: item.comments || Math.floor(Math.random() * 100) + 25,
          }
        };
        
        entertainmentItems.push(entertainmentContent);
      }
    } catch (transformError) {
      console.error('Error transforming entertainment data:', transformError);
      return this.getMockEntertainmentData();
    }

    return entertainmentItems.length > 0 ? entertainmentItems : this.getMockEntertainmentData();
  }

  private getMockEntertainmentData(): ContentItem[] {
    const funFacts = [
      "Honey never spoils and can last for thousands of years",
      "Octopuses have three hearts and blue blood",
      "A group of flamingos is called a 'flamboyance'",
      "Bananas are berries, but strawberries aren't",
      "The shortest war in history lasted only 38-45 minutes",
      "A shrimp's heart is in its head",
      "Wombat poop is cube-shaped",
      "There are more trees on Earth than stars in the Milky Way",
      "The unicorn is Scotland's national animal",
      "Dolphins have names for each other"
    ];

    return Array.from({ length: 20 }, (_, index) => ({
      id: `mock-entertainment-${index + 1}`,
      title: `Amazing Fun Fact #${index + 1}`,
      description: funFacts[index % funFacts.length] + ". Discover more fascinating facts that will entertain and educate you!",
      image: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop`,
      url: '#',
      type: 'entertainment',
      category: 'fun-facts',
      source: 'Amazing Facts',
      publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
      author: 'Facts Explorer',
      tags: ['fun-facts', 'entertainment', 'trivia', 'amazing'],
      readTime: 2,
      engagement: {
        likes: Math.floor(Math.random() * 800) + 200,
        shares: Math.floor(Math.random() * 150) + 50,
        comments: Math.floor(Math.random() * 100) + 25,
      }
    }));
  }

  async searchEntertainment(query: string): Promise<ContentItem[]> {
    const allEntertainment = await this.getEntertainmentData();
    return allEntertainment.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}

export const entertainmentServiceRapi = new EntertainmentServiceRapi(); 