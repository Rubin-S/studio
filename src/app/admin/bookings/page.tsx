import { getBookings } from '@/lib/bookings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, isValid, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

// Helper to safely format dates and prevent crashes from invalid date strings
const formatDateSafe = (dateString: string, formatString: string) => {
    if (!dateString) return 'N/A';
    const date = dateString.includes('T') ? parseISO(dateString) : new Date(dateString);
    return isValid(date) ? format(date, formatString) : 'N/A';
};

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  // Extract all unique form data keys to use as table headers
  const allKeys = new Set<string>();
  bookings.forEach(booking => {
    if (booking.formData) {
      Object.keys(booking.formData).forEach(key => allKeys.add(key));
    }
  });

  // Define a preferred order for common fields to display them first
  const preferredOrder = ['Full Name', 'Name', 'Email Address', 'Email', 'Phone Number', 'Phone'];
  
  const dynamicHeaders = Array.from(allKeys).sort((a, b) => {
    const indexA = preferredOrder.indexOf(a);
    const indexB = preferredOrder.indexOf(b);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB; // Both are in preferred order
    if (indexA !== -1) return -1; // A is preferred, B is not
    if (indexB !== -1) return 1;  // B is preferred, A is not
    return a.localeCompare(b); // Alphabetical for the rest
  });


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Course Bookings</h1>
        <p className="text-muted-foreground">A log of all student registrations, with details from your custom forms.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Total {bookings.length} bookings found.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Course</TableHead>
                  <TableHead className="whitespace-nowrap">Slot Date</TableHead>
                  <TableHead className="whitespace-nowrap">Start Time</TableHead>
                  <TableHead className="whitespace-nowrap">End Time</TableHead>
                  <TableHead className="whitespace-nowrap">Submitted On</TableHead>
                  {dynamicHeaders.map(header => (
                    <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                          <Badge variant="outline">{booking.courseTitle}</Badge>
                      </TableCell>
                      <TableCell>{formatDateSafe(booking.slotDate, 'PPP')}</TableCell>
                      <TableCell>{booking.slotStartTime}</TableCell>
                      <TableCell>{booking.slotEndTime}</TableCell>
                      <TableCell>{formatDateSafe(booking.submittedAt, 'PPp')}</TableCell>
                      {dynamicHeaders.map(header => (
                        <TableCell key={header} className="font-medium">
                          {booking.formData?.[header] || 'N/A'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5 + dynamicHeaders.length} className="text-center">No bookings found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
