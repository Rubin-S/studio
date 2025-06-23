import { getCourseById } from '@/lib/courses';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import BookingPageClient from './BookingPageClient';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourseById(params.id);
  if (!course) return { title: 'Booking Not Found' };
  return {
    title: `Book: ${course.title.en}`,
    description: `Book your slot for the ${course.title.en} course.`,
    robots: {
        index: false,
        follow: false,
    }
  };
}

export default async function CourseBookingPage({ params }: Props) {
  const course = await getCourseById(params.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <BookingPageClient course={course} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
