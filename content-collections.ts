import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const blogs = defineCollection({
  name: "blogs",
  directory: "src/content/blog",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    featured: z.boolean().optional().default(false),
    summary: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    content: z.string(),
  }),
  transform: async (document) => {
    return {
      ...document,
      slug: `${document._meta.path}`,
    };
  },
});

export default defineConfig({
  collections: [blogs],
});
