import axios from 'axios';
import { ContentItem } from '../types/content';

// Mock TMDB data since we don't have real API keys in this demo
const mockMovieData = [
  {
    id: 'movie-1',
    title: 'Quantum Nexus',
    description: 'A thrilling sci-fi adventure about a team of scientists who discover a portal to parallel dimensions, leading to an epic battle for the multiverse.',
    image: 'https://images.unsplash.com/photo-1489599735980-c4ed76d7cbef?w=800&h=1200&fit=crop',
    url: 'https://example.com/quantum-nexus',
    type: 'entertainment' as const,
    category: 'movie',
    source: 'TMDB',
    publishedAt: new Date().toISOString(),
    tags: ['sci-fi', 'action', 'thriller'],
    rating: 8.5,
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    releaseDate: '2024-01-15',
    cast: ['Emma Stone', 'Ryan Gosling', 'Oscar Isaac'],
  },
  {
    id: 'movie-2',
    title: 'The Last Garden',
    description: 'A heartwarming drama about a grandmother and her granddaughter who work together to save their family garden from urban development.',
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&h=1200&fit=crop',
    url: 'https://example.com/last-garden',
    type: 'entertainment' as const,
    category: 'movie',
    source: 'TMDB',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    tags: ['drama', 'family', 'heartwarming'],
    rating: 7.8,
    genre: ['Drama', 'Family'],
    releaseDate: '2024-02-20',
    cast: ['Meryl Streep', 'Saoirse Ronan', 'Tom Hanks'],
  },
  {
    id: 'movie-3',
    title: 'Code Breakers',
    description: 'A high-stakes thriller following a team of elite hackers as they race against time to prevent a global cyber attack.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=1200&fit=crop',
    url: 'https://example.com/code-breakers',
    type: 'entertainment' as const,
    category: 'movie',
    source: 'TMDB',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    tags: ['thriller', 'technology', 'action'],
    rating: 8.2,
    genre: ['Thriller', 'Action', 'Crime'],
    releaseDate: '2024-03-10',
    cast: ['Idris Elba', 'Lupita Nyong\'o', 'John Boyega'],
  },
];

class TMDBService {
  private baseURL = 'https://api.themoviedb.org/3';
  private apiKey = 'demo'; // In production, use environment variable

  async getTrending(page: number = 1): Promise<ContentItem[]> {
    try {
      // For demo purposes, return mock data
      // In production, uncomment the API call below:
      
      /*
      const response = await axios.get(`${this.baseURL}/trending/movie/day`, {
        params: {
          api_key: this.apiKey,
          page,
        },
      });

      return response.data.results.map((movie: any) => ({
        id: `movie-${movie.id}`,
        title: movie.title,
        description: movie.overview,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        url: `https://www.themoviedb.org/movie/${movie.id}`,
        type: 'entertainment',
        category: 'movie',
        source: 'TMDB',
        publishedAt: movie.release_date,
        tags: ['trending', 'movie'],
        rating: movie.vote_average,
        genre: movie.genre_ids,
        releaseDate: movie.release_date,
      }));
      */

      return mockMovieData;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return mockMovieData;
    }
  }

  async getMoviesByGenre(genres: string[]): Promise<ContentItem[]> {
    try {
      // Filter mock data by genres
      const filtered = mockMovieData.filter(movie =>
        genres.some(genre => 
          movie.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()))
        )
      );

      return filtered.length > 0 ? filtered : mockMovieData;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return mockMovieData;
    }
  }

  async searchMovies(query: string): Promise<ContentItem[]> {
    try {
      // Filter mock data for search
      const filtered = mockMovieData.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase()) ||
        movie.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
      );

      return filtered;
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }

  async getMovieDetails(id: string): Promise<ContentItem | null> {
    try {
      const movie = mockMovieData.find(m => m.id === id);
      return movie || null;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }
}

export const tmdbService = new TMDBService();