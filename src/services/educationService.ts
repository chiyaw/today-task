import { ContentItem } from '../types/content';

class EducationService {
  private baseURL = 'https://bhagavad-gita3.p.rapidapi.com/v2/chapters/?skip=0&limit=18';
  private apiKey = '24a1e6429emsh2b56062922407e1p1b40dcjsnb3d71a3bddbc';

  async getEducationData(): Promise<ContentItem[]> {
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': 'bhagavad-gita3.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(this.baseURL, options);
      const result = await response.text();
      console.log('Education API Response:', result);
      
      let data;
      try {
        data = JSON.parse(result);
      } catch (parseError) {
        console.error('Failed to parse education data:', parseError);
        return this.getMockEducationData();
      }

      return this.transformEducationData(data);
    } catch (error) {
      console.error('Error fetching education data:', error);
      return this.getMockEducationData();
    }
  }

  private transformEducationData(data: any): ContentItem[] {
    const educationItems: ContentItem[] = [];

    try {
      const items = Array.isArray(data) ? data : (data.data || data.chapters || [data]);
      
      items.slice(0, 20).forEach((item: any, index: number) => {
        const educationContent: ContentItem = {
          id: `education-${index}-${Date.now()}`,
          title: item.name || item.title || item.chapter_name || `Chapter ${index + 1}: Spiritual Wisdom`,
          description: item.summary || item.description || item.meaning || `Explore profound teachings from ancient wisdom texts that provide insights into life, dharma, and spiritual growth.`,
          image: item.image || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
          url: item.url || item.link || '#',
          type: 'educational' as any,
          category: 'philosophy',
          source: item.source || 'Bhagavad Gita',
          publishedAt: item.date || new Date().toISOString(),
          author: item.author || 'Ancient Wisdom',
          tags: ['philosophy', 'education', 'spirituality', 'wisdom'],
          readTime: 8,
          engagement: {
            likes: item.likes || Math.floor(Math.random() * 300) + 100,
            shares: item.shares || Math.floor(Math.random() * 50) + 20,
            comments: item.comments || Math.floor(Math.random() * 30) + 10,
          }
        };
        
        educationItems.push(educationContent);
      });
    } catch (transformError) {
      console.error('Error transforming education data:', transformError);
      return this.getMockEducationData();
    }

    return educationItems.length > 0 ? educationItems : this.getMockEducationData();
  }

  private getMockEducationData(): ContentItem[] {
    return Array.from({ length: 18 }, (_, index) => ({
      id: `mock-education-${index + 1}`,
      title: `Chapter ${index + 1}: Wisdom and Philosophy`,
      description: `Discover timeless teachings and philosophical insights that guide towards spiritual growth, self-realization, and understanding of life's deeper meaning.`,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
      url: '#',
      type: 'educational' as any,
      category: 'philosophy',
      source: 'Ancient Wisdom',
      publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
      author: 'Spiritual Guide',
      tags: ['philosophy', 'education', 'spirituality', 'wisdom'],
      readTime: 8,
      engagement: {
        likes: Math.floor(Math.random() * 300) + 100,
        shares: Math.floor(Math.random() * 50) + 20,
        comments: Math.floor(Math.random() * 30) + 10,
      }
    }));
  }

  async searchEducation(query: string): Promise<ContentItem[]> {
    const allEducation = await this.getEducationData();
    return allEducation.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}

export const educationService = new EducationService(); 