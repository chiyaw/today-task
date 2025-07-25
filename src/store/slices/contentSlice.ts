import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '../../types/content';
import { newsService } from '../../services/newsService';
import { tmdbService } from '../../services/tmdbService';
import { socialService } from '../../services/socialService';

export interface ContentState {
  items: ContentItem[];
  searchResults: ContentItem[];
  filteredItems: ContentItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  hasMore: boolean;
  page: number;
  activeFilter: string | null;
}

// Initial mock content for search to work immediately
const initialMockContent: ContentItem[] = [
  {
    id: 'initial-news-1',
    title: 'AI Technology Revolutionizes Modern Workplace',
    description: 'Artificial Intelligence is transforming how we work, with new tools improving productivity and efficiency across industries.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    url: 'https://example.com/ai-workplace',
    type: 'news',
    category: 'technology',
    source: 'TechNews',
    publishedAt: new Date().toISOString(),
    tags: ['AI', 'technology', 'workplace', 'productivity'],
    readTime: 5,
  },
  {
    id: 'initial-entertainment-1',
    title: 'The Future of Cinema: Virtual Reality Films',
    description: 'Explore how VR technology is creating immersive movie experiences that transport viewers into the story.',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&h=400&fit=crop',
    url: 'https://example.com/vr-cinema',
    type: 'entertainment',
    category: 'movie',
    source: 'TMDB',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    tags: ['VR', 'cinema', 'technology', 'entertainment'],
    rating: 8.5,
  },
  {
    id: 'initial-social-1',
    title: 'Sustainable Living Tips for 2024',
    description: 'Simple changes you can make today to reduce your environmental impact and live more sustainably.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
    url: 'https://example.com/sustainable-living',
    type: 'social',
    category: 'lifestyle',
    source: 'EcoLife',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    tags: ['sustainability', 'environment', 'lifestyle', 'tips'],
    engagement: { likes: 1234, shares: 89, comments: 156 },
  },
];

const initialState: ContentState = {
  items: initialMockContent,
  searchResults: [],
  filteredItems: [],
  loading: false,
  error: null,
  lastUpdated: null,
  hasMore: true,
  page: 1,
  activeFilter: null,
};

// Async thunks for fetching content
export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (params: { categories: string[]; topics: string[]; genres: string[]; hashtags: string[] }) => {
    const promises = [];
    
    if (params.categories.includes('news')) {
      promises.push(newsService.getNews(params.topics));
    }
    
    if (params.categories.includes('entertainment')) {
      promises.push(tmdbService.getTrending());
      promises.push(tmdbService.getMoviesByGenre(params.genres));
    }
    
    if (params.categories.includes('social')) {
      promises.push(socialService.getSocialPosts(params.hashtags));
    }

    const results = await Promise.all(promises);
    return results.flat();
  }
);

export const searchContent = createAsyncThunk(
  'content/searchContent',
  async (query: string) => {
    const promises = [
      newsService.searchNews(query),
      tmdbService.searchMovies(query),
      socialService.searchSocialPosts(query),
    ];

    const results = await Promise.all(promises);
    return results.flat();
  }
);

export const loadMoreContent = createAsyncThunk(
  'content/loadMoreContent',
  async (params: { categories: string[]; topics: string[]; genres: string[]; hashtags: string[]; page: number }) => {
    const promises = [];
    
    if (params.categories.includes('news')) {
      promises.push(newsService.getNews(params.topics, params.page));
    }
    
    if (params.categories.includes('entertainment')) {
      promises.push(tmdbService.getTrending(params.page));
    }

    const results = await Promise.all(promises);
    return results.flat();
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearContent: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.filteredItems = [];
      state.activeFilter = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    // Add category filtering
    filterByCategory: (state, action: PayloadAction<string | null>) => {
      const category = action.payload;
      state.activeFilter = category;
      
      if (!category) {
        state.filteredItems = [];
        return;
      }

      // Map the display categories to content types/categories
      const categoryMapping: { [key: string]: string[] } = {
        'news': ['news', 'technology', 'business'],
        'sports': ['sports'],
        'entertainment': ['entertainment', 'movie'],
        'social': ['social', 'lifestyle'],
        'educational': ['education', 'science'],
        'finance': ['business', 'finance'],
        'travel': ['travel', 'culture'],
        'lifestyle': ['lifestyle', 'wellness', 'health'],
        'technology': ['technology', 'science', 'innovation']
      };

      const mappedCategories = categoryMapping[category] || [category];
      
      state.filteredItems = state.items.filter(item =>
        mappedCategories.includes(item.type) ||
        mappedCategories.includes(item.category) ||
        item.tags.some(tag => mappedCategories.some(cat => tag.toLowerCase().includes(cat)))
      );
    },
    clearFilter: (state) => {
      state.activeFilter = null;
      state.filteredItems = [];
    },
    // Add local search that filters through existing items
    localSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase().trim();
      
      if (!query) {
        state.searchResults = [];
        return;
      }

      const itemsToSearch = state.activeFilter ? state.filteredItems : state.items;
      state.searchResults = itemsToSearch.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    },
    reorderContent: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
      const { startIndex, endIndex } = action.payload;
      const result = Array.from(state.items);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      state.items = result;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch content
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        // Merge with existing content, avoiding duplicates
        const newItems = action.payload.filter(
          newItem => !state.items.some(existingItem => existingItem.id === newItem.id)
        );
        state.items = [...state.items, ...newItems];
        state.lastUpdated = new Date().toISOString();
        state.page = 1;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch content';
      })
      // Search content
      .addCase(searchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search content';
      })
      // Load more content
      .addCase(loadMoreContent.fulfilled, (state, action) => {
        state.items.push(...action.payload);
        state.page += 1;
        state.hasMore = action.payload.length > 0;
      });
  },
});

export const { clearContent, clearSearchResults, localSearch, reorderContent, filterByCategory, clearFilter } = contentSlice.actions;

export default contentSlice.reducer;