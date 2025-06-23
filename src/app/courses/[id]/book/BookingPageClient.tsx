'use client';

import type { Course } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CourseBookingForm from '../CourseBookingForm';

type BookingPageClientProps = {
    course: Course;
}

export default function BookingPageClient({ course }: BookingPageClientProps) {
    const { t } = useLanguage();
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center font-headline text-3xl font-bold text-primary">{t({ en: 'Book Your Slot', ta: 'உங்கள் இடத்தை முன்பதிவு செய்யுங்கள்' })}</CardTitle>
                <p className="mt-2 text-center text-muted-foreground">{t({ en: `You are booking a slot for: ${course.title.en}`, ta: `நீங்கள் இதற்காக ஒரு இடத்தை முன்பதிவு செய்கிறீர்கள்: ${course.title.ta}`})}</p>
                <p className="mt-2 text-center text-muted-foreground">{t({ en: 'Select an available time and fill out your details to reserve your spot.', ta: 'கிடைக்கும் நேரத்தைத் தேர்ந்தெடுத்து, உங்கள் இடத்தை முன்பதிவு செய்ய உங்கள் விவரங்களைப் பூர்த்தி செய்யவும்.'})}</p>
            </CardHeader>
            <CardContent>
                <CourseBookingForm course={course} />
            </CardContent>
        </Card>
    );
}
