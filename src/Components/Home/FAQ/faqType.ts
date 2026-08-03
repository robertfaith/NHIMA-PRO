import type { ReactNode } from 'react';

export type FAQCategoryId =
  | 'all'
  | 'registration'
  | 'members'
  | 'employers'
  | 'providers'
  | 'benefits'
  | 'claims'
  | 'payments'
  | 'account'
  | 'general';

export interface FAQCategory {
  id: FAQCategoryId;
  label: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategoryId;
  keywords?: string[];
}

export interface HelpTopic {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  category: FAQCategoryId;
}

export interface SearchChip {
  label: string;
  category: FAQCategoryId;
}