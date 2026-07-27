import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const trainers = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/trainers' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    title: z.string(),
    photo: z.string().optional(),
    yearsOfExperience: z.number(),
    hoursDelivered: z.number(),
    participantsTrained: z.number(),
    projectsDelivered: z.number().default(0),
    shortBio: z.string(),
    certifications: z.array(z.object({
      name: z.string(),
      issuer: z.string(),
      year: z.number(),
      url: z.string().url().optional(),
    })),
    publications: z.array(z.string()).default([]),
    linkedin: z.string().url().optional(),
  }),
});

const validators = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/validators' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    role: z.string(),
    affiliation: z.string(),
    bio: z.string().optional(),
    qualifications: z.array(z.string()),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    titleSeo: z.string().max(80),
    metaDescription: z.string().max(180),
    excerpt: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('przemek-nowak'),
    category: z.enum(['dofinansowanie', 'narzedzia', 'bezpieczenstwo', 'praktyka', 'porownania']),
    categoryLabel: z.string(),
    readingTime: z.number(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

const faqs = defineCollection({
  loader: file('src/content/faqs/faq.json'),
  schema: z.object({
    id: z.string(),
    category: z.enum(['szkolenia', 'dofinansowanie', 'walidacja', 'techniczne']),
    categoryLabel: z.string(),
    question: z.string(),
    answer: z.string(),
    order: z.number(),
  }),
});

export const collections = {
  trainers,
  validators,
  articles,
  faqs,
};
