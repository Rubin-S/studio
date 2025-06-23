'use server';

import { revalidatePath } from 'next/cache';
import { createBooking } from '@/lib/bookings';
import { getCourseById } from '@/lib/courses';

export async function submitBookingAction(
  courseId: string,
  slotId: string,
  formData: { [key: string]: any },
  paymentId: string,
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
    // Get a flat list of all fields from all steps
    const allFields = course.registrationForm.steps.flatMap(step => step.fields);

    for (const key in formData) {
      // The key is `${field.id}-${language}`. A UUID (field.id) can contain hyphens.
      const parts = key.split('-');
      parts.pop(); // Remove the language code ('en' or 'ta')
      const fieldId = parts.join('-'); // Re-join the UUID parts
      
      const formField = allFields.find(f => f.id === fieldId);
      
      // We'll use the English label as the consistent key in the database.
      if (formField && formField.label.en) {
        // Only add non-empty values to cleaned data
        if (formData[key]) {
           cleanedFormData[formField.label.en] = formData[key];
        }
      }
    }
    
    const result = await createBooking(
      course.id,
      course.title.en,
      slot,
      cleanedFormData,
      paymentId,
    );

    if (result.success) {
      revalidatePath(`/courses/${courseId}/book`);
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
