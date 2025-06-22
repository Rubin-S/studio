import { getCourseById } from '@/lib/courses';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CourseDetailClient from './CourseDetailClient';
import type { Metadata, ResolvingMetadata } from 'next';
import type { Course } from '@/lib/types';

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const course = await getCourseById(params.id);

  if (!course) {
    return {
      title: 'Course Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: course.title.en,
    description: course.shortDescription.en,
    openGraph: {
      title: `${course.title.en} | SMDS`,
      description: course.shortDescription.en,
      images: [course.thumbnail, ...previousImages],
    },
  };
}


export default async function CourseDetailPage({ params }: Props) {
  const course = await getCourseById(params.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <CourseDetailClient course={course} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
