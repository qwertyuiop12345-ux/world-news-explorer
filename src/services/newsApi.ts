import axios from 'axios';
import { NewsArticle, NewsCategory, NewsResponse } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

// Axios instance with default config for Google News via NewsAPI
const newsApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'X-Api-Key': API_KEY,
  },
});

// Add request interceptor for better error handling
newsApiClient.interceptors.request.use(
  (config) => {
    // Add API key to URL params for NewsAPI
    if (config.params) {
      config.params.apiKey = API_KEY;
    } else {
      config.params = { apiKey: API_KEY };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
newsApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific API errors
      const { status, data } = error.response;
      if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else if (status === 426) {
        throw new Error('API key upgrade required for this feature.');
      } else if (data?.message) {
        throw new Error(data.message);
      }
    }
    throw error;
  }
);


/**
 * Fetch top headlines for a specific country using Google News
 * @param countryCode ISO 3166-1 alpha-2 country code (lowercase)
 * @param category News category filter
 * @param pageSize Number of articles to return (max 100)
 */
export const getTopHeadlines = async (
  countryCode: string,
  category?: NewsCategory,
  pageSize: number = 20
): Promise<NewsArticle[]> => {
  try {
    const params: Record<string, string | number> = {
      country: countryCode.toLowerCase(),
      pageSize: Math.min(pageSize, 100),
    };

    // Add category if specified and not 'general'
    if (category && category !== 'general') {
      params.category = category;
    }

    const response = await newsApiClient.get<NewsResponse>('/top-headlines', {
      params,
    });

    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to fetch news');
    }

    return response.data.articles.map((article, index) => ({
      ...article,
      id: `${article.url}-${index}-${Date.now()}`,
      category,
    }));
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw error;
  }
};

/**
 * Fetch everything (all articles) for a country with advanced search
 * @param query Search query (country name, topic, etc.)
 * @param category News category filter
 * @param pageSize Number of articles to return
 * @param sortBy Sort order: publishedAt, relevancy, popularity
 */
export const searchNews = async (
  query: string,
  category?: NewsCategory,
  pageSize: number = 20,
  sortBy: 'publishedAt' | 'relevancy' | 'popularity' = 'publishedAt'
): Promise<NewsArticle[]> => {
  try {
    // Build search query with category if specified
    let searchQuery = query;
    if (category && category !== 'general') {
      searchQuery = `${query} ${category}`;
    }

    const params: Record<string, string | number> = {
      q: searchQuery,
      sortBy,
      pageSize: Math.min(pageSize, 100),
      language: 'en',
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const response = await newsApiClient.get<NewsResponse>('/everything', {
      params,
    });

    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to fetch news');
    }

    return response.data.articles.map((article, index) => ({
      ...article,
      id: `${article.url}-${index}-${Date.now()}`,
      category,
    }));
  } catch (error) {
    console.error('Error searching news:', error);
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw error;
  }
};

/**
 * Fetch news by country name (fallback method)
 * @param countryName Full country name
 * @param category News category filter
 * @param pageSize Number of articles
 */
export const getNewsByCountry = async (
  countryName: string,
  category?: NewsCategory,
  pageSize: number = 20
): Promise<NewsArticle[]> => {
  return searchNews(countryName, category, pageSize, 'relevancy');
};

/**
 * Get news for multiple categories at once
 * @param countryCode ISO country code
 * @param categories Array of categories to fetch
 */
export const getNewsByCategories = async (
  countryCode: string,
  categories: NewsCategory[]
): Promise<Record<NewsCategory, NewsArticle[]>> => {
  try {
    const requests = categories.map(category =>
      getTopHeadlines(countryCode, category, 10).catch(() => [])
    );

    const results = await Promise.all(requests);
    
    const newsMap: Record<string, NewsArticle[]> = {};
    categories.forEach((category, index) => {
      newsMap[category] = results[index];
    });

    return newsMap as Record<NewsCategory, NewsArticle[]>;
  } catch (error) {
    console.error('Error fetching news by categories:', error);
    throw error;
  }
};

/**
 * Get trending/popular news globally
 * @param pageSize Number of articles
 */
export const getTrendingNews = async (pageSize: number = 10): Promise<NewsArticle[]> => {
  try {
    const response = await newsApiClient.get<NewsResponse>('/top-headlines', {
      params: {
        language: 'en',
        pageSize: Math.min(pageSize, 100),
      },
    });

    return response.data.articles.map((article, index) => ({
      ...article,
      id: `${article.url}-${index}-${Date.now()}`,
    }));
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return [];
  }
};

/**
 * Search news with advanced filters
 * @param query Search query
 * @param options Search options
 */
export const advancedSearch = async (
  query: string,
  options: {
    category?: NewsCategory;
    sources?: string[];
    domains?: string[];
    excludeDomains?: string[];
    from?: Date;
    to?: Date;
    language?: string;
    sortBy?: 'publishedAt' | 'relevancy' | 'popularity';
    pageSize?: number;
  } = {}
): Promise<NewsArticle[]> => {
  try {
    const params: Record<string, string | number> = {
      q: query,
      language: options.language || 'en',
      sortBy: options.sortBy || 'publishedAt',
      pageSize: Math.min(options.pageSize || 20, 100),
    };

    if (options.sources?.length) {
      params.sources = options.sources.join(',');
    }

    if (options.domains?.length) {
      params.domains = options.domains.join(',');
    }

    if (options.excludeDomains?.length) {
      params.excludeDomains = options.excludeDomains.join(',');
    }

    if (options.from) {
      params.from = options.from.toISOString();
    }

    if (options.to) {
      params.to = options.to.toISOString();
    }

    const response = await newsApiClient.get<NewsResponse>('/everything', {
      params,
    });

    return response.data.articles.map((article, index) => ({
      ...article,
      id: `${article.url}-${index}-${Date.now()}`,
      category: options.category,
    }));
  } catch (error) {
    console.error('Error in advanced search:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};

/**
 * Format date for display (relative time)
 * @param dateString ISO date string
 */
export const formatPublishedDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

/**
 * Get news source favicon URL
 * @param sourceUrl Source website URL
 */
export const getSourceFavicon = (sourceUrl: string): string => {
  try {
    const url = new URL(sourceUrl);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`;
  } catch {
    return '';
  }
};

/**
 * Validate and sanitize article data
 * @param article News article
 */
export const sanitizeArticle = (article: NewsArticle): NewsArticle => {
  return {
    ...article,
    title: article.title || 'No title available',
    description: article.description || null,
    urlToImage: article.urlToImage || null,
    author: article.author || null,
    content: article.content || null,
  };
};
