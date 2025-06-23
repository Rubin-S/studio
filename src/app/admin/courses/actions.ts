'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createCourse, updateCourse, deleteCourse } from '@/lib/courses';
import { v4 as uuidv4 } from 'uuid';

const localizedStringSchema = z.object({
  en: z.string().min(1, 'English value is required'),
  ta: z.string().min(1, 'Tamil value is required'),
});

const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'email', 'tel', 'textarea', 'select']),
  label: localizedStringSchema,
  placeholder: localizedStringSchema.optional(),
  required: z.boolean(),
  options: z.array(localizedStringSchema).optional(),
});

const courseSlotSchema = z.object({
  id: z.string(),
  dateTime: z.string().min(1, 'Date and time is required'),
  bookedBy: z.object({
    name: z.string(),
    bookingId: z.string(),
  }).nullable(),
});

const formSchema = z.object({
  title: localizedStringSchema,
  thumbnail: z.string().url('Must be a valid URL'),
  shortDescription: localizedStringSchema,
  detailedDescription: localizedStringSchema,
  whatWeOffer: z.array(localizedStringSchema),
  price: z.object({
    original: z.coerce.number().min(0),
    discounted: z.coerce.number().min(0),
  }),
  instructions: localizedStringSchema,
  youtubeLink: z.string().url().optional().or(z.literal('')),
  documentUrl: z.string().url().optional().or(z.literal('')),
  formFields: z.array(formFieldSchema),
  slots: z.array(courseSlotSchema),
});

export async function createCourseAction(data: z.infer<typeof formSchema>) {
  const validatedData = formSchema.parse(data);
  const dataWithIds = {
    ...validatedData,
    formFields: validatedData.formFields.map(field => ({ ...field, id: field.id || uuidv4() })),
    slots: validatedData.slots.map(slot => ({ ...slot, id: slot.id || uuidv4(), bookedBy: null })),
  };
  await createCourse(dataWithIds);
  revalidatePath('/admin/courses');
  revalidatePath('/courses');
}

export async function updateCourseAction(id: string, data: z.infer<typeof formSchema>) {
  const validatedData = formSchema.parse(data);
  const dataWithIds = {
    ...validatedData,
    formFields: validatedData.formFields.map(field => ({ ...field, id: field.id || uuidv4() })),
    slots: validatedData.slots.map(slot => ({ ...slot, id: slot.id || uuidv4() })),
  };
  await updateCourse(id, dataWithIds);
  revalidatePath('/admin/courses');
  revalidatePath(`/courses/${id}`);
  revalidatePath('/courses');
}

export async function deleteCourseAction(id: string) {
  if (!id) throw new Error("ID is required");
  await deleteCourse(id);
  revalidatePath('/admin/courses');
  revalidatePath('/courses');
  revalidatePath('/admin/bookings');
}
