// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: `docs/**/*.mdx`,
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
    published: {
      type: "boolean",
      default: true
    }
  }
}));
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
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Doc, Activity],
  mdx: {
    rehypePlugins: [],
    remarkPlugins: []
  },
  disableImportAliasWarning: true
});
export {
  Activity,
  Doc,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-NRL5T2AA.mjs.map
