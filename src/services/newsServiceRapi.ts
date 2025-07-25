import { ContentItem } from '../types/content';

class NewsServiceRapi {
  private baseURL = 'https://current-affairs-of-india.p.rapidapi.com/recent';
  private apiKey = '24a1e6429emsh2b56062922407e1p1b40dcjsnb3d71a3bddbc';

  async getNewsData(): Promise<ContentItem[]> {
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': 'current-affairs-of-india.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(this.baseURL, options);
      const result = await response.text();
      console.log('News API Response:', result);
      
      let data;
      try {
        data = JSON.parse(result);
      } catch (parseError) {
        console.error('Failed to parse news data:', parseError);
        return this.getMockNewsData();
      }

      return this.transformNewsData(data);
    } catch (error) {
      console.error('Error fetching news data:', error);
      return this.getMockNewsData();
    }
  }

  private transformNewsData(data: any): ContentItem[] {
    const newsItems: ContentItem[] = [];

    try {
      const items = Array.isArray(data) ? data : (data.data || data.articles || data.news || [data]);
      
      items.slice(0, 20).forEach((item: any, index: number) => {
        const newsContent: ContentItem = {
          id: `news-rapi-${index}-${Date.now()}`,
          title: item.title || item.headline || item.name || `Current Affairs Update ${index + 1}`,
          description: item.description || item.summary || item.content || item.details || `Important current affairs update from India covering recent developments and news.`,
          image: item.image || item.thumbnail || item.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
          url: item.url || item.link || item.newsUrl || '#',
          type: 'news',
          category: 'current-affairs',
          source: item.source || 'Current Affairs India',
          publishedAt: item.date || item.publishedAt || item.timestamp || new Date().toISOString(),
          author: item.author || item.reporter || 'News Reporter',
          tags: ['current-affairs', 'india', 'news', 'politics'],
          readTime: 4,
          engagement: {
            likes: item.likes || Math.floor(Math.random() * 500) + 50,
            shares: item.shares || Math.floor(Math.random() * 100) + 10,
            comments: item.comments || Math.floor(Math.random() * 50) + 5,
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
      title: `Current Affairs Update ${index + 1}`,
      description: `Stay updated with the latest current affairs and important news developments from India. This covers political, economic, and social updates.`,
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
      url: '#',
      type: 'news',
      category: 'current-affairs',
      source: 'India News',
      publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
      author: 'News Team',
      tags: ['current-affairs', 'india', 'politics', 'news'],
      readTime: 4,
      engagement: {
        likes: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 50) + 5,
      }
    }));
  }

  async searchNews(query: string): Promise<ContentItem[]> {
    const allNews = await this.getNewsData();
    return allNews.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}

export const newsServiceRapi = new NewsServiceRapi(); 