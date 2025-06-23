'use client';

import { useState, useMemo } from 'react';
import type { Course, Booking } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isValid, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { FileSearch } from 'lucide-react';

interface BookingsClientProps {
  courses: Course[];
  bookings: Booking[];
}

// Helper to safely format dates
const formatDateSafe = (dateString: string, formatString: string) => {
    if (!dateString) return 'N/A';
    const date = dateString.includes('T') ? parseISO(dateString) : new Date(dateString);
    return isValid(date) ? format(date, formatString) : 'N/A';
};

export default function BookingsClient({ courses, bookings }: BookingsClientProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const { selectedCourse, filteredBookings, tableHeaders } = useMemo(() => {
    if (!selectedCourseId) {
      return { selectedCourse: null, filteredBookings: [], tableHeaders: [] };
    }

    const course = courses.find(c => c.id === selectedCourseId);
    if (!course) {
      return { selectedCourse: null, filteredBookings: [], tableHeaders: [] };
    }

    const headers = course.registrationForm.steps.flatMap(step => 
        step.fields.map(field => field.label.en)
    );

    const filtered = bookings.filter(b => b.courseId === selectedCourseId);

    return { selectedCourse: course, filteredBookings: filtered, tableHeaders: headers };
  }, [selectedCourseId, courses, bookings]);

  return (
    <div className="space-y-6">
      <Select onValueChange={setSelectedCourseId} value={selectedCourseId}>
        <SelectTrigger className="w-full md:w-1/3">
          <SelectValue placeholder="Select a course to view bookings..." />
        </SelectTrigger>
        <SelectContent>
          {courses.map(course => (
            <SelectItem key={course.id} value={course.id}>{course.title.en}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedCourseId ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedCourse?.title.en || 'Bookings'}</CardTitle>
            <CardDescription>
              {filteredBookings.length} booking(s) found for this course.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Slot Date</TableHead>
                      <TableHead className="whitespace-nowrap">Time</TableHead>
                      <TableHead className="whitespace-nowrap">Submitted On</TableHead>
                      {tableHeaders.map(header => (
                        <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{formatDateSafe(booking.slotDate, 'PPP')}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{booking.slotStartTime} - {booking.slotEndTime}</Badge>
                        </TableCell>
                        <TableCell>{formatDateSafe(booking.submittedAt, 'PPp')}</TableCell>
                        {tableHeaders.map(header => (
                          <TableCell key={header} className="font-medium">
                            {booking.formData?.[header] || 'N/A'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
                <div className="text-center py-16">
                    <FileSearch className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No bookings found for this course yet.</p>
                </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="flex items-center justify-center h-64 border-2 border-dashed">
            <div className="text-center">
                 <FileSearch className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Please select a course to view its bookings.</p>
            </div>
        </Card>
      )}
    </div>
  );
}
