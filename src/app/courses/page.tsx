import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCourses } from '@/lib/courses';
import CourseCard from './CourseCard';

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center">
            <h1 className="font-headline text-4xl font-bold text-primary">Our Driving Courses</h1>
            <p className="mx-auto mt-2 max-w-2xl text-lg text-muted-foreground">
              Choose the perfect course to start your journey towards becoming a licensed driver.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
