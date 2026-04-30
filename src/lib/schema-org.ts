// Schema.org JSON-LD builders
import { SITE, OPERATOR } from './site';

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: SITE.shortName,
  legalName: OPERATOR.legalName,
  url: SITE.url,
  logo: `${SITE.url}/logo.svg`,
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: OPERATOR.street,
    postalCode: OPERATOR.postal,
    addressLocality: OPERATOR.city,
    addressCountry: OPERATOR.country,
  },
  taxID: OPERATOR.nip,
  vatID: OPERATOR.vatID,
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'KRS', value: OPERATOR.krs },
    { '@type': 'PropertyValue', propertyID: 'REGON', value: OPERATOR.regon },
  ],
  sameAs: [OPERATOR.burProviderUrl],
};

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  inLanguage: 'pl-PL',
  publisher: { '@id': `${SITE.url}/#organization` },
};

export function breadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: `${SITE.url}${item.url}` } : {}),
    })),
  };
}

export function courseSchema(opts: {
  slug: string;
  name: string;
  description: string;
  level: string;
  durationHours: number;
  priceNet: number;
  startDate?: string;
  endDate?: string;
  trainerName?: string;
  teaches?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${SITE.url}/szkolenia/${opts.slug}/#course`,
    name: opts.name,
    description: opts.description,
    provider: {
      '@type': 'Organization',
      name: OPERATOR.legalName,
      url: SITE.url,
      sameAs: OPERATOR.burProviderUrl,
    },
    educationalLevel: opts.level,
    inLanguage: 'pl',
    teaches: opts.teaches ?? [],
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseSchedule: {
        '@type': 'Schedule',
        duration: `PT${opts.durationHours}H`,
        repeatFrequency: 'Monthly',
      },
      ...(opts.trainerName && {
        instructor: {
          '@type': 'Person',
          name: opts.trainerName,
          url: `${SITE.url}/trener/`,
        },
      }),
      ...(opts.startDate && { startDate: opts.startDate }),
      ...(opts.endDate && { endDate: opts.endDate }),
    },
    offers: {
      '@type': 'Offer',
      price: String(opts.priceNet),
      priceCurrency: 'PLN',
      availability: 'https://schema.org/InStock',
      url: `${SITE.url}/szkolenia/${opts.slug}/`,
    },
  };
}

export function eventSchema(opts: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  url: string;
  priceNet: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: opts.name,
    description: opts.description,
    startDate: opts.startDate,
    endDate: opts.endDate,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      url: `${SITE.url}${opts.url}`,
    },
    organizer: {
      '@type': 'Organization',
      name: OPERATOR.legalName,
      url: SITE.url,
    },
    offers: {
      '@type': 'Offer',
      price: String(opts.priceNet),
      priceCurrency: 'PLN',
      availability: 'https://schema.org/InStock',
      url: `${SITE.url}${opts.url}`,
    },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  publishDate: string;
  authorName: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: `${SITE.url}${opts.url}`,
    datePublished: opts.publishDate,
    author: { '@type': 'Person', name: opts.authorName },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.svg` },
    },
  };
}
