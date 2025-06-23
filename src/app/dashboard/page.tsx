'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getBookingsByUserId } from '@/lib/bookings';
import type { Booking } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, UserCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

// A resilient date formatting function to prevent crashes
const formatDateSafe = (dateString: string) => {
    try {
        const date = parseISO(dateString);
        if (isValid(date)) {
            return format(date, 'PPP'); // e.g., Jun 1, 2024
        }
    } catch (e) {
        // Fallthrough to return 'Invalid Date'
    }
    return 'Invalid Date';
};


export default function DashboardPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getBookingsByUserId(user.uid)
                .then(data => {
                    setBookings(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch bookings:", err);
                    setLoading(false);
                });
        }
    }, [user]);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <UserCircle className="h-12 w-12 text-primary" />
                <div>
                    <h1 className="font-headline text-3xl font-bold">My Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.displayName || user?.email}!</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>My Bookings</CardTitle>
                    <CardDescription>Here are the courses you've booked.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {loading && (
                        <>
                            <Skeleton className="h-32 w-full rounded-lg" />
                            <Skeleton className="h-32 w-full rounded-lg" />
                        </>
                    )}
                    {!loading && bookings.length === 0 && (
                        <div className="text-center py-10">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">You haven't booked any courses yet.</p>
                        </div>
                    )}
                    {!loading && bookings.map(booking => (
                        <Card key={booking.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                             <div className="md:col-span-2">
                                <h3 className="font-semibold text-lg text-primary">{booking.courseTitle}</h3>
                                 <div className="mt-2 text-sm text-muted-foreground space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Date: {formatDateSafe(booking.slotDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>Time: {booking.slotStartTime} - {booking.slotEndTime}</span>
                                    </div>
                                </div>
                            </div>
                             <div className="flex items-center justify-start md:justify-end">
                                {booking.paymentVerified ? (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Payment Verified
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive">
                                        <AlertCircle className="mr-2 h-4 w-4" />
                                        Verification Pending
                                    </Badge>
                                )}
                            </div>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
