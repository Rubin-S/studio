'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export async function verifyPaymentAction(bookingId: string): Promise<{ success: boolean; error?: string }> {
  if (!bookingId) {
    return { success: false, error: 'Booking ID is required.' };
  }

  const db = getDb();
  if (!db) {
    return { success: false, error: 'Database not initialized.' };
  }

  const bookingRef = doc(db, 'bookings', bookingId);

  try {
    const bookingSnap = await getDoc(bookingRef);
    if (!bookingSnap.exists()) {
      return { success: false, error: 'Booking not found.' };
    }

    await updateDoc(bookingRef, { paymentVerified: true });

    revalidatePath('/admin/bookings');

    return { success: true };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { success: false, error: 'Failed to update payment status.' };
  }
}
