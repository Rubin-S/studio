import { getCourses } from '@/lib/courses';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smds-app.web.app';

  // Get all courses
  const courses = await getCourses();
  const courseEntries: MetadataRoute.Sitemap = courses.map(({ id }) => ({
    url: `${siteUrl}/courses/${id}`,
    lastModified: new Date(),
  }));

  // Define static routes
  const staticRoutes = [
    '',
    '/courses',
    '/about',
    '/contact',
    '/login',
    '/legal/privacy-policy',
    '/legal/terms-and-conditions',
    '/legal/cancellation-and-refund',
    '/legal/shipping-and-delivery',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  return [
    ...staticEntries,
    ...courseEntries,
  ];
}
