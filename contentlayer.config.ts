import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Snippet = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: `components/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the documentation",
      required: true,
    },
    description: {
      type: "string",
      description: "A short description",
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (_) => _._raw.sourceFileName.replace(/\.[^.$]+$/, ""),
    },
  },
}));

export default makeSource({
  contentDirPath: "src/doc",
  documentTypes: [Snippet],
});
