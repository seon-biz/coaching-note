import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const thumbnailSchema = z.discriminatedUnion('pattern', [
  z.object({
    pattern: z.literal('keyword'),
    keyword: z.string().min(1).max(4),
  }),
  z.object({
    pattern: z.literal('fragment'),
    fragment: z.string(),
    highlight: z.string().optional(),
  }),
  z.object({
    pattern: z.literal('numeral'),
    number: z.string(),
    unit: z.string().optional(),
    quote: z.string().optional(),
  }),
  z.object({
    pattern: z.literal('question'),
    question: z.string(),
    attribution: z.string().optional(),
  }),
  z.object({
    pattern: z.literal('list'),
    items: z.array(z.string()).length(3),
    highlight: z.number().min(0).max(2).optional(),
    footer: z.string().optional(),
  }),
]);

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    number: z.number(),
    category: z.string(),
    date: z.date(),
    excerpt: z.string(),
    readingTime: z.string().optional(),
    thumbnail: thumbnailSchema,
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
export const liveCollections = {};
