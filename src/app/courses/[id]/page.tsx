import { getCourseById } from '@/lib/courses';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CourseDetailClient from './CourseDetailClient';

type Props = {
  params: { id: string };
};

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
