'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createCourse, updateCourse } from '@/lib/courses';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/firebase';
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';

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

const navigationRuleSchema = z.object({
  fieldId: z.string().min(1),
  value: z.string().min(1),
  nextStepId: z.string().min(1),
});

const formStepSchema = z.object({
  id: z.string(),
  name: localizedStringSchema,
  fields: z.array(formFieldSchema),
  navigationRules: z.array(navigationRuleSchema).optional(),
});

const registrationFormSchema = z.object({
  steps: z.array(formStepSchema),
});

const courseSlotSchema = z.object({
  id: z.string(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  bookedBy: z
    .object({
      name: z.string(),
      bookingId: z.string(),
    })
    .nullable(),
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
  registrationForm: registrationFormSchema,
  slots: z.array(courseSlotSchema),
});

// Helper function to ensure all nested items have IDs
const ensureIds = (data: z.infer<typeof formSchema>) => {
  return {
    ...data,
    registrationForm: {
      steps: data.registrationForm.steps.map(step => ({
        ...step,
        id: step.id || uuidv4(),
        fields: step.fields.map(field => ({
          ...field,
          id: field.id || uuidv4(),
        })),
      })),
    },
    slots: data.slots.map(slot => ({
      ...slot,
      id: slot.id || uuidv4(),
    })),
  };
};

export async function createCourseAction(data: z.infer<typeof formSchema>) {
  const validatedData = formSchema.parse(data);
  const dataWithIds = ensureIds(validatedData);
  await createCourse(dataWithIds);
  revalidatePath('/admin/courses');
  revalidatePath('/courses');
}

export async function updateCourseAction(
  id: string,
  data: z.infer<typeof formSchema>
) {
  const validatedData = formSchema.parse(data);
  const dataWithIds = ensureIds(validatedData);
  await updateCourse(id, dataWithIds);
  revalidatePath('/admin/courses');
  revalidatePath(`/courses/${id}`);
  revalidatePath('/courses');
}

export async function deleteCourseAction(id: string) {
  if (!id) {
    throw new Error('ID is required');
  }

  const db = getDb();
  if (!db) {
    throw new Error('Database not initialized.');
  }

  try {
    const batch = writeBatch(db);

    // 1. Find and delete associated bookings for the course
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('courseId', '==', id));
    const bookingsSnapshot = await getDocs(q);
    bookingsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 2. Delete the course itself
    const courseRef = doc(db, 'courses', id);
    batch.delete(courseRef);

    // 3. Commit all deletions in one atomic operation
    await batch.commit();

    revalidatePath('/admin/courses');
    revalidatePath('/courses');
    revalidatePath('/admin/bookings');
  } catch (error) {
    console.error('Failed to delete course and its bookings:', error);
    // Re-throw the error so the client can catch it
    throw new Error('Failed to delete course and associated bookings.');
  }
}
