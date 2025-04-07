// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
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
  documentTypes: [Activity],
  mdx: {
    rehypePlugins: [],
    remarkPlugins: []
  }
});
export {
  Activity,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-TS3HGHDD.mjs.map
