'use server';

import { revalidatePath } from 'next/cache';
import { createBooking } from '@/lib/bookings';
import { getCourseById } from '@/lib/courses';

export async function submitBookingAction(
  courseId: string,
  slotId: string,
  formData: { [key: string]: any }
) {
  try {
    const course = await getCourseById(courseId);
    if (!course) {
      return { success: false, error: 'Course not found.' };
    }

    const slot = course.slots.find(s => s.id === slotId);
    if (!slot) {
      return { success: false, error: 'Selected slot not found.' };
    }

    if (slot.bookedBy) {
      return { success: false, error: 'This slot has already been booked.' };
    }

    // Clean up formData keys to be more generic for storage
    const cleanedFormData: { [key: string]: string } = {};
    for (const key in formData) {
      // The key is `${field.id}-${language}`. We want to find the original field label.
      const fieldId = key.split('-')[0];
      const formField = course.formFields.find(f => f.id === fieldId);
      
      // We'll use the English label as the consistent key in the database.
      if (formField && formField.label.en) {
        cleanedFormData[formField.label.en] = formData[key];
      }
    }
    
    const result = await createBooking(
      course.id,
      course.title.en,
      slot.id,
      slot.dateTime,
      cleanedFormData
    );

    if (result.success) {
      revalidatePath(`/courses/${courseId}`);
      revalidatePath('/admin/bookings');
      return { success: true, bookingId: result.bookingId };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in submitBookingAction:', error);
    return { success: false, error: 'An unexpected server error occurred.' };
  }
}
