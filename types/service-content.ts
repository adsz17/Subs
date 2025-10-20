export type ServiceContentLayout = 'text' | 'cards' | 'accordion' | 'markdown';

export interface ServiceContentMedia {
  type: 'image' | 'video' | 'embed';
  url: string;
  caption?: string;
}

export interface ServiceContentResource {
  id: string;
  label: string;
  url: string;
}

export interface ServiceContentItem {
  id: string;
  title: string;
  body?: string;
  media?: ServiceContentMedia;
}

export interface ServiceContentSection {
  id: string;
  title?: string;
  layout: ServiceContentLayout;
  body?: string;
  media?: ServiceContentMedia;
  resources?: ServiceContentResource[];
  items?: ServiceContentItem[];
}

export interface ServiceContent {
  version: number;
  sections: ServiceContentSection[];
  metadata?: {
    legacyMarkdown?: boolean;
  };
}

export const CURRENT_CONTENT_VERSION = 1;
