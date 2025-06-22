'use client';

import { useLanguage } from '@/hooks/useLanguage';
import type { Course } from '@/lib/types';
import Image from 'next/image';
import { CheckCircle, BookUser, Calendar, Youtube, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CourseDetailClientProps = {
  course: Course;
};

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg shadow-lg md:h-96">
        <Image
          src={course.thumbnail}
          alt={t(course.title)}
          layout="fill"
          objectFit="cover"
          priority
          data-ai-hint="driving lesson view"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 p-8">
          <h1 className="font-headline text-3xl font-bold text-white md:text-5xl">{t(course.title)}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">{t({ en: 'What We Offer', ta: 'நாங்கள் வழங்குவது' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {course.whatWeOffer.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-muted-foreground">{t(feature)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">{t({ en: 'Detailed Description', ta: 'விரிவான விளக்கம்' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">{t(course.detailedDescription)}</p>
            </CardContent>
          </Card>

          {course.youtubeLink && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
                    <Youtube /> {t({ en: 'Training Video', ta: 'பயிற்சி வீடியோ' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <iframe width="100%" height="100%" src={course.youtubeLink} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </div>
                </CardContent>
              </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">{t({ en: 'Price Details', ta: 'விலை விவரங்கள்' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold">₹{course.price.discounted.toLocaleString('en-IN')}</p>
                <p className="text-lg text-muted-foreground line-through">₹{course.price.original.toLocaleString('en-IN')}</p>
              </div>
              <div className="mt-2 text-sm font-semibold text-green-600">
                {t({ en: `You save ₹${(course.price.original - course.price.discounted).toLocaleString('en-IN')}`, ta: `நீங்கள் ₹${(course.price.original - course.price.discounted).toLocaleString('en-IN')} சேமிக்கிறீர்கள்` })}
              </div>
            </CardContent>
          </Card>

            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
                      <Info /> {t({ en: 'Instructions', ta: 'அறிவுறுத்தல்கள்' })}
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-sm text-muted-foreground">{t(course.instructions)}</p>
              </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="mt-8">
          <h2 className="text-center font-headline text-3xl font-bold text-primary">{t({ en: 'Book Your Slot', ta: 'உங்கள் இடத்தை முன்பதிவு செய்யுங்கள்' })}</h2>
          <p className="mt-2 text-center text-muted-foreground">{t({ en: '1. Select an available date and time below.', ta: '1. கீழே கிடைக்கும் தேதி மற்றும் நேரத்தைத் தேர்ந்தெடுக்கவும்.'})}</p>
          <p className="text-center text-muted-foreground">{t({ en: '2. After selecting, fill out the registration form.', ta: '2. தேர்ந்தெடுத்த பிறகு, பதிவுப் படிவத்தைப் பூர்த்தி செய்யவும்.'})}</p>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {course.googleCalendarLink && (
                  <Card>
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2 font-headline text-xl text-primary"><Calendar /> {t({ en: 'Step 1: Select a Slot', ta: 'படி 1: ஒரு இடத்தைத் தேர்ந்தெடுக்கவும்' })}</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="aspect-square w-full overflow-hidden rounded-lg">
                              <iframe src={course.googleCalendarLink} style={{border:0}} width="100%" height="100%" frameBorder="0" scrolling="no" title="Booking Calendar"></iframe>
                          </div>
                      </CardContent>
                  </Card>
              )}
              {course.googleFormLink && (
                  <Card>
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2 font-headline text-xl text-primary"><BookUser /> {t({ en: 'Step 2: Register Your Details', ta: 'படி 2: உங்கள் விவரங்களைப் பதிவு செய்யவும்' })}</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="aspect-square w-full overflow-hidden rounded-lg">
                              <iframe src={course.googleFormLink} width="100%" height="100%" frameBorder="0" marginHeight={0} marginWidth={0} title="Registration Form">Loading…</iframe>
                          </div>
                      </CardContent>
                  </Card>
              )}
          </div>
      </div>
    </>
  );
}
