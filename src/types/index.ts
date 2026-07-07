// Core types for the World News Explorer application

export interface Country {
  name: string;
  code: string;
  iso2: string;
  iso3: string;
  capital: string;
  population: number;
  region: string;
  subregion: string;
  flag: string;
  currency: string;
  languages: string[];
  area: number;
  government: string;
  timezone: string;
  coordinates: [number, number];
}

export interface NewsArticle {
  id: string;
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  category?: NewsCategory;
}

export type NewsCategory = 
  | 'general'
  | 'business'
  | 'technology'
  | 'sports'
  | 'entertainment'
  | 'science'
  | 'health'
  | 'politics';

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
  code?: string;
  message?: string;
}

export interface TooltipData {
  country: string;
  capital: string;
  population: number;
  region: string;
  flag: string;
  x: number;
  y: number;
}

export interface MapState {
  selectedCountry: Country | null;
  hoveredCountry: string | null;
  zoom: number;
  center: [number, number];
}

export interface ThemeMode {
  mode: 'light' | 'dark';
  toggle: () => void;
}
