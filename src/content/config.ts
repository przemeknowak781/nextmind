import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const trainers = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/trainers' }),
  // Świadomie nie ma tu pól na liczbę godzin, uczestników czy lat
  // doświadczenia. Takich danych nie mamy skąd potwierdzić, a wpisane „na oko"
  // są dokładnie tym rodzajem liczby, który podważa wiarygodność całej strony.
  // Zaufanie budujemy na tym, co da się sprawdzić: wpis dostawcy w BUR,
  // imienne certyfikaty i publiczny profil zawodowy.
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    title: z.string(),
    /** Zdjęcie w public/. Bez niego karta pokazuje monogram z inicjałami. */
    photo: z.string().optional(),
    /** Kolejność na stronie zespołu — mniejsza liczba wyżej. */
    order: z.number().default(50),
    /** Jedno zdanie na kartę. Puste, dopóki nie mamy tekstu od trenera. */
    shortBio: z.string().optional(),
    /** Obszary, które prowadzi. */
    focus: z.array(z.string()).default([]),
    certifications: z.array(z.object({
      name: z.string(),
      issuer: z.string(),
      year: z.number(),
      /** Odnośnik do weryfikacji certyfikatu, jeśli wystawca go udostępnia. */
      url: z.string().url().optional(),
    })).default([]),
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
