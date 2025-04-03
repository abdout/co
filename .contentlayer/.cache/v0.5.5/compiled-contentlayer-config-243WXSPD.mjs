// contentlayer.config.ts
import {
  defineDocumentType,
  makeSource
} from "contentlayer2/source-files";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
var computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/")
  },
  url: {
    type: "string",
    resolve: (doc) => {
      const docPath = doc._raw.flattenedPath;
      return `/docs/${docPath}`;
    }
  },
  // Extract category, subCategory, and activity from the path
  category: {
    type: "string",
    resolve: (doc) => {
      const parts = doc._raw.flattenedPath.split("/");
      return parts[0] || "";
    }
  },
  subCategory: {
    type: "string",
    resolve: (doc) => {
      const parts = doc._raw.flattenedPath.split("/");
      return parts.length > 1 ? parts[1] : "";
    }
  },
  activityName: {
    type: "string",
    resolve: (doc) => {
      const parts = doc._raw.flattenedPath.split("/");
      return parts.length > 2 ? parts[2] : "";
    }
  }
};
var Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: "docs/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true
    },
    description: {
      type: "string",
      required: true
    }
  },
  computedFields
}));
var Activity = defineDocumentType(() => ({
  name: "Activity",
  filePathPattern: "mos/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true
    },
    description: {
      type: "string",
      required: true
    },
    systemType: {
      type: "string",
      required: true
    },
    subitem: {
      type: "string",
      required: true
    }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Doc, Activity],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word--highlighted"];
          }
        }
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section"
          }
        }
      ]
    ]
  }
});
export {
  Activity,
  Doc,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-243WXSPD.mjs.map
