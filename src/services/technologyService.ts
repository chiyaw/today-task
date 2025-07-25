import { ContentItem } from '../types/content';

class TechnologyService {
  private baseURL = 'https://patienceman-docs1.p.rapidapi.com/public/doc-tags';
  private apiKey = '24a1e6429emsh2b56062922407e1p1b40dcjsnb3d71a3bddbc';

  async getTechnologyData(): Promise<ContentItem[]> {
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': 'patienceman-docs1.p.rapidapi.com',
        'Accept': 'Application/json'
      }
    };

    try {
      const response = await fetch(this.baseURL, options);
      const result = await response.text();
      console.log('Technology API Response:', result);
      
      let data;
      try {
        data = JSON.parse(result);
      } catch (parseError) {
        console.error('Failed to parse technology data:', parseError);
        return this.getMockTechnologyData();
      }

      return this.transformTechnologyData(data);
    } catch (error) {
      console.error('Error fetching technology data:', error);
      return this.getMockTechnologyData();
    }
  }

  private transformTechnologyData(data: any): ContentItem[] {
    const technologyItems: ContentItem[] = [];

    try {
      const items = Array.isArray(data) ? data : (data.data || data.tags || data.docs || [data]);
      
      // Generate 20 technology items
      for (let i = 0; i < 20; i++) {
        const item = items[i % Math.max(items.length, 1)] || {};
        const technologyContent: ContentItem = {
          id: `technology-${i}-${Date.now()}`,
          title: item.name || item.title || item.tag || `Tech Innovation ${i + 1}`,
          description: item.description || item.summary || item.content || `Explore the latest in technology trends, innovations, and digital transformation. Stay updated with cutting-edge developments in tech.`,
          image: item.image || `https://images.unsplash.com/photo-${1518709268372 + i}-3dcdd618f10?w=800&h=400&fit=crop`,
          url: item.url || item.link || '#',
          type: 'technology' as any,
          category: 'tech',
          source: item.source || 'Tech Docs',
          publishedAt: item.date || new Date(Date.now() - i * 3600000).toISOString(),
          author: item.author || 'Tech Expert',
          tags: ['technology', 'innovation', 'digital', 'tech'],
          readTime: 7,
          engagement: {
            likes: item.likes || Math.floor(Math.random() * 700) + 200,
            shares: item.shares || Math.floor(Math.random() * 100) + 40,
            comments: item.comments || Math.floor(Math.random() * 90) + 30,
          }
        };
        
        technologyItems.push(technologyContent);
      }
    } catch (transformError) {
      console.error('Error transforming technology data:', transformError);
      return this.getMockTechnologyData();
    }

    return technologyItems.length > 0 ? technologyItems : this.getMockTechnologyData();
  }

  private getMockTechnologyData(): ContentItem[] {
    const techTopics = [
      "Artificial Intelligence Breakthroughs in 2024",
      "Quantum Computing: The Next Frontier",
      "Blockchain Technology Beyond Cryptocurrency",
      "5G Networks and IoT Revolution",
      "Cybersecurity Trends and Best Practices",
      "Cloud Computing: Multi-Cloud Strategies",
      "Machine Learning in Healthcare",
      "Sustainable Technology Solutions",
      "Virtual Reality and Metaverse Development",
      "Edge Computing and Data Processing"
    ];

    return Array.from({ length: 20 }, (_, index) => ({
      id: `mock-technology-${index + 1}`,
      title: techTopics[index % techTopics.length],
      description: `Discover the latest technological innovations and their impact on our digital future. Expert insights into emerging tech trends and solutions.`,
      image: `https://images.unsplash.com/photo-1518709268372-3dcdd618f10?w=800&h=400&fit=crop`,
      url: '#',
      type: 'technology' as any,
      category: 'tech',
      source: 'Tech Today',
      publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
      author: 'Technology Reporter',
      tags: ['technology', 'innovation', 'digital', 'tech'],
      readTime: 7,
      engagement: {
        likes: Math.floor(Math.random() * 700) + 200,
        shares: Math.floor(Math.random() * 100) + 40,
        comments: Math.floor(Math.random() * 90) + 30,
      }
    }));
  }

  async searchTechnology(query: string): Promise<ContentItem[]> {
    const allTechnology = await this.getTechnologyData();
    return allTechnology.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}

export const technologyService = new TechnologyService(); 