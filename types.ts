export interface Angle {
  title: string;
  whyItWorks: string;
  coreBenefits: string;
  hooks: string[];
  tagline: string;
  targetAudience: string;
  visuals: string;
  platforms: string[];
  shortVersion: string;
}

export interface Category {
  categoryName: string;
  angles: Angle[];
}

export interface MarketingAnalysis {
  productSummary: string;
  categories: Category[];
}

export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  base64: string | null;
}