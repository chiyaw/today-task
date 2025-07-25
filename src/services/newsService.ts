import axios from 'axios';
import { ContentItem } from '../types/content';

// Mock NewsAPI since we don't have real API keys in this demo
// In production, you would use real NewsAPI endpoint
const mockNewsData = [
  {
    id: 'news-1',
    title: 'Breakthrough in Quantum Computing Achieved by Tech Giants',
    description: 'Major technology companies have announced significant advances in quantum computing technology, bringing us closer to practical quantum computers.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
    url: 'https://example.com/quantum-breakthrough',
    type: 'news' as const,
    category: 'technology',
    source: 'TechNews',
    publishedAt: new Date().toISOString(),
    author: 'Dr. Sarah Chen',
    tags: ['quantum', 'technology', 'computing'],
    readTime: 5,
  },
  {
    id: 'news-2',
    title: 'Global Markets React to New Economic Policies',
    description: 'Stock markets worldwide showed mixed reactions to the newly announced economic policies, with tech stocks leading the gains.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    url: 'https://example.com/market-reaction',
    type: 'news' as const,
    category: 'business',
    source: 'FinanceDaily',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    author: 'Mike Johnson',
    tags: ['markets', 'economy', 'finance'],
    readTime: 3,
  },
  {
    id: 'news-3',
    title: 'Revolutionary Medical Treatment Shows Promise in Clinical Trials',
    description: 'A new gene therapy treatment has shown remarkable results in early clinical trials, offering hope for patients with rare genetic disorders.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
    url: 'https://example.com/medical-breakthrough',
    type: 'news' as const,
    category: 'science',
    source: 'MedicalNews',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    author: 'Dr. Emily Rodriguez',
    tags: ['medicine', 'genetics', 'health'],
    readTime: 7,
  },
];

class NewsService {
  private baseURL = 'https://newsapi.org/v2';
  private apiKey = 'demo'; // In production, use environment variable

  async getNews(topics: string[], page: number = 1): Promise<ContentItem[]> {
    try {
      // For demo purposes, return mock data
      // In production, uncomment the API call below:
      
      /*
      const topicsQuery = topics.join(' OR ');
      const response = await axios.get(`${this.baseURL}/everything`, {
        params: {
          q: topicsQuery,
          apiKey: this.apiKey,
          page,
          pageSize: 10,
          sortBy: 'publishedAt',
        },
      });

      return response.data.articles.map((article: any) => ({
        id: `news-${article.url.split('/').pop()}`,
        title: article.title,
        description: article.description,
        image: article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
        url: article.url,
        type: 'news',
        category: topics[0] || 'general',
        source: article.source.name,
        publishedAt: article.publishedAt,
        author: article.author,
        tags: topics,
        readTime: Math.ceil(article.content?.length / 200) || 3,
      }));
      */

      // Filter mock data based on topics
      const filteredNews = mockNewsData.filter(item => 
        topics.some(topic => item.category.includes(topic) || item.tags.includes(topic))
      );

      return filteredNews.length > 0 ? filteredNews : mockNewsData;
    } catch (error) {
      console.error('Error fetching news:', error);
      return mockNewsData; // Fallback to mock data
    }
  }

  async searchNews(query: string): Promise<ContentItem[]> {
    try {
      // For demo purposes, filter mock data
      const filtered = mockNewsData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      return filtered;
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    }
  }

  async getTopHeadlines(category: string = 'general'): Promise<ContentItem[]> {
    return this.getNews([category]);
  }
}

export const newsService = new NewsService();