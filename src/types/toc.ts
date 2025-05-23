export interface TableOfContentsItem {
  title: string;
  url: string;
  depth?: number;
  items: TableOfContentsItem[];
}

export interface TableOfContents {
  items: TableOfContentsItem[];
} 