'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createCourse, updateCourse, deleteCourse } from '@/lib/courses';

const formSchema = z.object({
  title: z.object({
    en: z.string().min(1, 'English title is required'),
    ta: z.string().min(1, 'Tamil title is required'),
  }),
  thumbnail: z.string().url('Must be a valid URL'),
  shortDescription: z.object({
    en: z.string().min(1, 'English short description is required'),
    ta: z.string().min(1, 'Tamil short description is required'),
  }),
  detailedDescription: z.object({
    en: z.string().min(1, 'English detailed description is required'),
    ta: z.string().min(1, 'Tamil detailed description is required'),
  }),
  whatWeOffer: z.array(z.object({
    en: z.string().min(1, 'English feature is required'),
    ta: z.string().min(1, 'Tamil feature is required'),
  })),
  price: z.object({
    original: z.coerce.number().min(0),
    discounted: z.coerce.number().min(0),
  }),
  instructions: z.object({
    en: z.string().min(1, 'English instructions are required'),
    ta: z.string().min(1, 'Tamil instructions are required'),
  }),
  youtubeLink: z.string().url().optional().or(z.literal('')),
  googleCalendarLink: z.string().url().optional().or(z.literal('')),
  googleFormLink: z.string().url().optional().or(z.literal('')),
});

export async function createCourseAction(data: z.infer<typeof formSchema>) {
  const validatedData = formSchema.parse(data);
  await createCourse(validatedData);
  revalidatePath('/admin/courses');
  revalidatePath('/courses');
}

export async function updateCourseAction(id: string, data: z.infer<typeof formSchema>) {
  const validatedData = formSchema.parse(data);
  await updateCourse(id, validatedData);
  revalidatePath('/admin/courses');
  revalidatePath(`/courses/${id}`);
  revalidatePath('/courses');
}

export async function deleteCourseAction(id: string) {
  if (!id) throw new Error("ID is required");
  await deleteCourse(id);
  revalidatePath('/admin/courses');
  revalidatePath('/courses');
}
