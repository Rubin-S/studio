import { getCourses } from '@/lib/courses';
import { getBookings } from '@/lib/bookings';
import BookingsClient from './BookingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const courses = await getCourses();
  const bookings = await getBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Course Bookings</h1>
        <p className="text-muted-foreground">Select a course to view its registrations and submitted form data.</p>
      </div>
      <BookingsClient courses={courses} bookings={bookings} />
    </div>
  );
}
