'use client';

import { useLanguage } from '@/hooks/useLanguage';
import type { Course } from '@/lib/types';
import type { Language } from '@/contexts/LanguageContext';

type CourseDetailClientProps = {
  course: Course;
  children: (
    t: (translations: { en: string; ta: string } | undefined) => string
  ) => React.ReactNode;
};

export default function CourseDetailClient({ course, children }: CourseDetailClientProps) {
  const { t } = useLanguage();
  return <>{children(t)}</>;
}
