'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Course } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { t } = useLanguage();

  const discountPercentage = Math.round(
    ((course.price.original - course.price.discounted) / course.price.original) * 100
  );

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full">
          <Image
            src={course.thumbnail}
            alt={t(course.title)}
            layout="fill"
            objectFit="cover"
            data-ai-hint="driving lessons"
          />
           <Badge className="absolute right-2 top-2 bg-accent text-accent-foreground">
            {discountPercentage}% OFF
          </Badge>
        </div>
        <div className="p-6">
            <CardTitle className="font-headline text-xl">{t(course.title)}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{t(course.shortDescription)}</p>
        <div className="mt-4 flex items-baseline gap-2">
          <p className="text-2xl font-bold text-primary">₹{course.price.discounted.toLocaleString('en-IN')}</p>
          <p className="text-md text-muted-foreground line-through">₹{course.price.original.toLocaleString('en-IN')}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/courses/${course.id}`}>{t({ en: 'Book Now', ta: 'இப்போதே பதிவு செய்' })}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
