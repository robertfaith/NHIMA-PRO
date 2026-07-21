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
  count?: number;
}

export interface FAQItem {
  id: string;
  category: FAQCategoryId;
  question: string;
  answer: string;
  /** Optional extra keywords to widen search matching beyond question/answer text */
  keywords?: string[];
}

export interface HelpTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** Category to jump to when the card is clicked */
  targetCategory: FAQCategoryId;
}

export interface SearchChip {
  label: string;
  targetCategory: FAQCategoryId;
}
