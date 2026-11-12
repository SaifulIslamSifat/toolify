export type ToolCategory =
  | "image"
  | "pdf"
  | "calculators"
  | "unit-converters"
  | "text"
  | "developer"
  | "generators"
  | "seo"
  | "internet"
  | "fiverr";

export type ToolStatus = "active" | "beta" | "coming-soon";

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface HowToStep {
  title: string;
  description: string;
}

export interface ToolDefinition {
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  shortDescription: string;
  keywords: string[];
  synonyms: string[];
  icon: string;
  status: ToolStatus;
  isPopular?: boolean;
  isFeatured?: boolean;
  badge?: string;
  howToSteps: HowToStep[];
  faqs: ToolFAQ[];
  features?: string[];
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  slug: string;
  description: string;
  icon: string;
  gradient: string;
}
