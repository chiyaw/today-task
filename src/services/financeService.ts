import { ContentItem } from '../types/content';

class FinanceService {
  private baseURL = 'https://financial-business-news-api.p.rapidapi.com/api/v1/news/article/dafd873c-94b1-31ae-ac4b-d47c303f0d82';
  private apiKey = '24a1e6429emsh2b56062922407e1p1b40dcjsnb3d71a3bddbc';

  async getFinanceData(): Promise<ContentItem[]> {
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': 'financial-business-news-api.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(this.baseURL, options);
      const result = await response.text();
      console.log('Finance API Response:', result);
      
      let data;
      try {
        data = JSON.parse(result);
      } catch (parseError) {
        console.error('Failed to parse finance data:', parseError);
        return this.getMockFinanceData();
      }

      return this.transformFinanceData(data);
    } catch (error) {
      console.error('Error fetching finance data:', error);
      return this.getMockFinanceData();
    }
  }

  private transformFinanceData(data: any): ContentItem[] {
    const financeItems: ContentItem[] = [];

    try {
      // Since this API returns a single article, we'll create multiple items based on it
      const baseItem = data || {};
      
      // Generate 20 finance items using variations
      for (let i = 0; i < 20; i++) {
        const financeContent: ContentItem = {
          id: `finance-${i}-${Date.now()}`,
          title: baseItem.title || `Financial Market Update ${i + 1}`,
          description: baseItem.description || baseItem.content || `Stay informed about the latest developments in financial markets, business trends, and economic analysis. Get insights that matter for your investments.`,
          image: baseItem.image || `https://images.unsplash.com/photo-${1611974789855 + i}-9c2a0a7236a3?w=800&h=400&fit=crop`,
          url: baseItem.url || baseItem.link || '#',
          type: 'finance' as any,
          category: 'business',
          source: baseItem.source || 'Financial News',
          publishedAt: baseItem.publishedAt || new Date(Date.now() - i * 3600000).toISOString(),
          author: baseItem.author || 'Finance Reporter',
          tags: ['finance', 'business', 'markets', 'economy'],
          readTime: 5,
          engagement: {
            likes: baseItem.likes || Math.floor(Math.random() * 400) + 100,
            shares: baseItem.shares || Math.floor(Math.random() * 80) + 20,
            comments: baseItem.comments || Math.floor(Math.random() * 60) + 15,
          }
        };
        
        financeItems.push(financeContent);
      }
    } catch (transformError) {
      console.error('Error transforming finance data:', transformError);
      return this.getMockFinanceData();
    }

    return financeItems.length > 0 ? financeItems : this.getMockFinanceData();
  }

  private getMockFinanceData(): ContentItem[] {
    const financeTopics = [
      "Stock Market Rally Continues Amid Economic Optimism",
      "Cryptocurrency Regulations: What Investors Need to Know",
      "Real Estate Market Trends for 2024",
      "Tech Stocks Lead Market Growth This Quarter",
      "Federal Reserve Policy Updates and Market Impact",
      "ESG Investing: Sustainable Finance Trends",
      "Small Business Growth Strategies",
      "Global Economic Outlook and Predictions",
      "Personal Finance Tips for Young Professionals",
      "Banking Sector Analysis and Future Prospects"
    ];

    return Array.from({ length: 20 }, (_, index) => ({
      id: `mock-finance-${index + 1}`,
      title: financeTopics[index % financeTopics.length],
      description: `Professional analysis and insights into current financial markets and business trends. Stay ahead with expert commentary and data-driven perspectives.`,
      image: `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop`,
      url: '#',
      type: 'finance' as any,
      category: 'business',
      source: 'Business Weekly',
      publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
      author: 'Financial Analyst',
      tags: ['finance', 'business', 'markets', 'economy'],
      readTime: 5,
      engagement: {
        likes: Math.floor(Math.random() * 400) + 100,
        shares: Math.floor(Math.random() * 80) + 20,
        comments: Math.floor(Math.random() * 60) + 15,
      }
    }));
  }

  async searchFinance(query: string): Promise<ContentItem[]> {
    const allFinance = await this.getFinanceData();
    return allFinance.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}

export const financeService = new FinanceService(); 