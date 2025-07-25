import { ContentItem } from '../types/content';

class NewsServiceRapi {
  private baseURL = 'https://newsdata.io/api/1/latest';
  private apiKey = 'h0li60HSGmBXQVeVFgolIEZw99Jbf9sYU6BdFaAXLreHVvwN';

  async getNewsData(): Promise<ContentItem[]> {
    try {
      const url = `${this.baseURL}?apikey=${this.apiKey}&q=electric%20vehicles%20OR%20sustainability&domainurl=news.google.com&size=20&language=en`;
      
      const response = await fetch(url);
      const result = await response.json();
      
      console.log('NewsData.io API Response:', result);
      
      if (result.status === 'success' && result.results) {
        return this.transformNewsData(result.results);
      } else {
        console.error('API Error:', result.message || 'Unknown error');
        return this.getMockNewsData();
      }
    } catch (error) {
      console.error('Error fetching news data:', error);
      return this.getMockNewsData();
    }
  }

  private transformNewsData(data: any[]): ContentItem[] {
    const newsItems: ContentItem[] = [];

    try {
      data.slice(0, 20).forEach((item: any, index: number) => {
        const newsContent: ContentItem = {
          id: `news-newsdata-${item.article_id || index}-${Date.now()}`,
          title: item.title || `News Update ${index + 1}`,
          description: item.description || item.content || `Latest news update covering electric vehicles and sustainability developments.`,
          image: item.image_url || 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&h=400&fit=crop',
          url: item.link || item.source_url || '#',
          type: 'news',
          category: item.category?.[0] || 'technology',
          source: item.source_name || 'Google News',
          publishedAt: item.pubDate || new Date().toISOString(),
          author: item.creator?.[0] || 'News Reporter',
          tags: item.keywords || ['electric vehicles', 'sustainability', 'technology'],
          readTime: 4,
          engagement: {
            likes: Math.floor(Math.random() * 500) + 50,
            shares: Math.floor(Math.random() * 100) + 10,
            comments: Math.floor(Math.random() * 50) + 5,
          }
        };
        
        newsItems.push(newsContent);
      });
    } catch (transformError) {
      console.error('Error transforming news data:', transformError);
      return this.getMockNewsData();
    }

    return newsItems.length > 0 ? newsItems : this.getMockNewsData();
  }

  private getMockNewsData(): ContentItem[] {
    return Array.from({ length: 20 }, (_, index) => ({
      id: `mock-news-${index + 1}`,
      title: `Electric Vehicle News Update ${index + 1}`,
      description: `Stay updated with the latest developments in electric vehicles and sustainable technology. This covers automotive innovation, green energy, and environmental sustainability.`,
      image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&h=400&fit=crop',
      url: '#',
      type: 'news',
      category: 'technology',
      source: 'Google News',
      publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
      author: 'News Team',
      tags: ['electric vehicles', 'sustainability', 'technology', 'green energy'],
      readTime: 4,
      engagement: {
        likes: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 50) + 5,
      }
    }));
  }

  async searchNews(query: string): Promise<ContentItem[]> {
    try {
      const url = `${this.baseURL}?apikey=${this.apiKey}&q=${encodeURIComponent(query)}%20AND%20(electric%20vehicles%20OR%20sustainability)&domainurl=news.google.com&language=en&size=20`;
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.status === 'success' && result.results) {
        return this.transformNewsData(result.results);
      } else {
        return this.getMockNewsData().filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
      }
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    }
  }
}

export const newsServiceRapi = new NewsServiceRapi(); 