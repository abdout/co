// Type definitions for contentlayer2
declare module 'contentlayer/generated' {
  export interface Doc {
    title: string;
    description: string;
    body: {
      code: string;
      raw: string;
    };
    slug: string;
    slugAsParams: string;
    url: string;
    category: string;
    subCategory: string;
    activityName: string;
    _raw: {
      flattenedPath: string;
    };
    _id: string;
    _type: 'Doc';
  }

  export const allDocs: Doc[];
}

declare module 'next-contentlayer2/hooks' {
  import { FC, ComponentProps } from 'react';
  
  export const useMDXComponent: (code: string) => FC<{
    components?: Record<string, FC<any>>;
  }>;
} 