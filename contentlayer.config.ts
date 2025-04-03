import {
  defineDocumentType,
  makeSource,
  ComputedFields,
} from 'contentlayer2/source-files';
import { toUrlPath } from './src/lib/utils';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

const computedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
  },
  url: {
    type: 'string',
    resolve: (doc) => {
      // Create URL from the raw path
      const docPath = doc._raw.flattenedPath;
      return `/docs/${docPath}`;
    },
  },
  // Extract category, subCategory, and activity from the path
  category: {
    type: 'string',
    resolve: (doc) => {
      const parts = doc._raw.flattenedPath.split('/');
      return parts[0] || '';
    },
  },
  subCategory: {
    type: 'string',
    resolve: (doc) => {
      const parts = doc._raw.flattenedPath.split('/');
      return parts.length > 1 ? parts[1] : '';
    },
  },
  activityName: {
    type: 'string',
    resolve: (doc) => {
      const parts = doc._raw.flattenedPath.split('/');
      return parts.length > 2 ? parts[2] : '';
    },
  },
};

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: 'docs/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
  },
  computedFields,
}));

export const Activity = defineDocumentType(() => ({
  name: 'Activity',
  filePathPattern: 'mos/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    systemType: {
      type: 'string',
      required: true,
    },
    subitem: {
      type: 'string',
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Doc, Activity],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          onVisitLine(node: any) {
            // Prevent lines from collapsing in `display: grid` mode, and
            // allow empty lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node: any) {
            // Adding highlighted line styles
            node.properties.className.push('line--highlighted');
          },
          onVisitHighlightedWord(node: any) {
            // Adding highlighted word styles
            node.properties.className = ['word--highlighted'];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
}); 