import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const courses = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/courses' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    titleSeo: z.string().max(80),
    metaDescription: z.string().max(180),
    eyebrow: z.string(),
    summary: z.string(),
    longSummary: z.string().optional(),
    level: z.enum(['podstawowy', 'sredniozaawansowany', 'zaawansowany']),
    levelLabel: z.string(),
    durationHours: z.number(),
    durationLabel: z.string(),
    format: z.enum(['online-live', 'stacjonarne', 'hybrydowe']),
    formatLabel: z.string(),
    language: z.string().default('polski'),
    minParticipants: z.number(),
    maxParticipants: z.number(),
    burCardId: z.string().optional(),
    burCardUrl: z.string().url().optional(),
    priceNet: z.number(),
    priceGross: z.number().optional(),
    priceWithKfs: z.number().optional(),
    /** @deprecated Zakładało stały pułap 80% dla ścieżki regionalnej — taki pułap nie istnieje.
     *  Poziom wsparcia ustala regulamin naboru u operatora i różni się między województwami. */
    priceWithPsf: z.number().optional(),
    vatExemptInfo: z.string().default('Zwolniony z VAT przy dofinansowaniu ≥70% (art. 43 ust. 1 pkt 29 ustawy o VAT).'),
    trainer: z.string(),
    validator: z.string(),
    targetAudience: z.array(z.string()),
    prerequisites: z.array(z.string()),
    educationalGoal: z.string(),
    businessGoal: z.string().optional(),
    keyTools: z.array(z.string()),
    teaches: z.array(z.string()),
    learningOutcomes: z.array(z.object({
      area: z.enum(['wiedza', 'umiejetnosci', 'kompetencje-spoleczne']),
      outcome: z.string(),
      verificationCriterion: z.string(),
      validationMethod: z.string(),
      digcompMapping: z.string().optional(),
    })),
    modules: z.array(z.object({
      title: z.string(),
      durationMin: z.number(),
      summary: z.string(),
      tools: z.array(z.string()),
      content: z.array(z.string()),
      exercises: z.array(z.string()),
    })),
    validationMethod: z.object({
      summary: z.string(),
      components: z.array(z.string()),
      passingThreshold: z.string(),
    }),
    materials: z.array(z.string()),
    licenseInfo: z.string(),
    technicalRequirements: z.array(z.string()),
    relatedCourses: z.array(z.string()).optional(),
    relatedArticles: z.array(z.string()).optional(),
    order: z.number().default(0),
  }),
});

const editions = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/editions' }),
  schema: z.object({
    courseSlug: z.string(),
    date: z.coerce.date(),
    startTime: z.string(),
    endTime: z.string(),
    timezone: z.string().default('Europe/Warsaw'),
    platform: z.enum(['Zoom', 'Microsoft Teams', 'Google Meet']),
    seatsTotal: z.number(),
    seatsAvailable: z.number(),
    burEditionUrl: z.string().url().optional(),
    status: z.enum(['planned', 'open-for-signup', 'closing-soon', 'fully-booked', 'completed', 'cancelled']),
    schedule: z.array(z.object({
      no: z.string(),
      timeFrom: z.string(),
      timeTo: z.string(),
      duration: z.number(),
      topic: z.string(),
      form: z.string(),
    })),
  }),
});

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
  courses,
  editions,
  trainers,
  validators,
  articles,
  faqs,
};
