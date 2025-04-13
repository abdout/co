// Type definitions for contentlayer2
declare module 'contentlayer/generated' {
  export interface Doc {
    title: string;
    description: string;
    category: string;
    subCategory: string;
    activityName: string;
    published: boolean;
    body: {
      code: string;
      raw: string;
    };
    slug: string;
    slugAsParams: string;
    url: string;
    _raw: {
      flattenedPath: string;
      sourceFilePath: string;
      sourceFileName: string;
      sourceFileDir: string;
      contentType: string;
      flattenedPath: string;
    };
    _id: string;
    _type: 'Doc';
    type: 'Doc';
  }

  export interface Activity {
    title: string;
    system: string;
    category: string;
    description: string;
    body: {
      code: string;
      raw: string;
    };
    slug: string;
    slugAsParams: string;
    url: string;
    _id: string;
    _type: 'Activity';
  }

  export const allDocs: Doc[];
  export const allActivities: Activity[];
}

declare module 'next-contentlayer2/hooks' {
  import { FC, ComponentProps } from 'react';
  
  export const useMDXComponent: (code: string) => FC<{
    components?: Record<string, FC<any>>;
  }>;
} 