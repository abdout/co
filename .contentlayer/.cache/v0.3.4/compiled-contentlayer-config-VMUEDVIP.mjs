// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
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
      return `/mos/${docPath}`;
    }
  },
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
var Activity = defineDocumentType(() => ({
  name: "Activity",
  filePathPattern: `mos/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true
    },
    system: {
      type: "string",
      required: true
    },
    category: {
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
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Activity],
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
            node.properties.className.push("highlighted");
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word"];
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
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-VMUEDVIP.mjs.map
