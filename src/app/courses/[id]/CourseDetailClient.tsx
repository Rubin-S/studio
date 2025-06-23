'use client';

import { useLanguage } from '@/hooks/useLanguage';
import type { Course } from '@/lib/types';
import Image from 'next/image';
import { CheckCircle, Calendar, Youtube, Info, FileText, Download, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type CourseDetailClientProps = {
  course: Course;
};

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const { t } = useLanguage();
  // Simplified logic: Check if there's at least one slot that is not booked.
  // Optional chaining handles cases where `slots` is null or undefined.
  // .some() on an empty array correctly returns false.
  const hasAvailableSlots = course.slots?.some(slot => !slot.bookedBy);

  return (
    <>
      <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg shadow-lg md:h-96">
        <Image
          src={course.thumbnail}
          alt={t(course.title)}
          fill
          className="object-cover"
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
          
          {hasAvailableSlots ? (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
                  <Calendar /> {t({ en: 'Book Your Slot', ta: 'உங்கள் இடத்தை முன்பதிவு செய்யுங்கள்' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">{t({ en: 'Slots are available! Click the button below to go to the booking page.', ta: 'இடங்கள் உள்ளன! முன்பதிவுப் பக்கத்திற்குச் செல்ல, கீழே உள்ள பொத்தானைக் கிளிக் செய்யவும்.' })}</p>
                <Button asChild className="w-full">
                  <Link href={`/courses/${course.id}/book`}>
                    {t({ en: 'Book Now', ta: 'இப்போதே முன்பதிவு செய்யவும்' })}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
             <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>{t({en: "No Slots Available", ta: "இடங்கள் எதுவும் இல்லை"})}</AlertTitle>
                <AlertDescription>
                    {t({en: "All slots for this course are currently booked or none have been scheduled. Please check back later.", ta: "இந்தப் பாடத்திற்கான அனைத்து இடங்களும் தற்போது முன்பதிவு செய்யப்பட்டுவிட்டன அல்லது எதுவும் திட்டமிடப்படவில்லை. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ."})}
                </AlertDescription>
            </Alert>
          )}


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
            
          {course.documentUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
                  <FileText /> {t({ en: 'Course Materials', ta: 'பாடப் பொருட்கள்' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">{t({ en: 'Download course syllabus, guides, and other materials.', ta: 'பாடத்திட்டம், வழிகாட்டிகள் மற்றும் பிற பொருட்களைப் பதிவிறக்கவும்.' })}</p>
                <Button asChild className="w-full">
                  <a href={course.documentUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    {t({ en: 'Download Materials', ta: 'பொருட்களைப் பதிவிறக்கவும்' })}
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
