import { unstable_noStore as noStore } from 'next/cache';
import type { Booking } from './types';
import { db } from './firebase';
import { collection, getDocs, query, orderBy, doc, runTransaction } from 'firebase/firestore';

const handleDbError = (context: string) => {
  console.warn(`[DB] ${context}: Firestore is not initialized. This is expected if Firebase environment variables are not set.`);
};

export async function getBookings(): Promise<Booking[]> {
  noStore();
  if (!db) {
    handleDbError("Fetching bookings");
    return [];
  }
  try {
    const bookingsCollection = collection(db, 'bookings');
    const q = query(bookingsCollection, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    return bookings;
  } catch (error) {
    console.error("[DB] Error fetching bookings. This might be due to Firestore security rules.", error);
    return [];
  }
}

export async function createBooking(
  courseId: string,
  courseTitle: string,
  slotId: string,
  slotDateTime: string,
  formData: { [key: string]: string }
): Promise<{ success: boolean; bookingId?: string; error?: string }> {
    if (!db) {
        handleDbError("Creating booking");
        return { success: false, error: "Database not initialized." };
    }

    const courseRef = doc(db, 'courses', courseId);
    const bookingsCollection = collection(db, 'bookings');

    try {
        const bookingId = await runTransaction(db, async (transaction) => {
            const courseDoc = await transaction.get(courseRef);
            if (!courseDoc.exists()) {
                throw new Error("Course not found.");
            }

            const courseData = courseDoc.data();
            const slots = courseData.slots || [];
            const slotIndex = slots.findIndex((s: { id: string; }) => s.id === slotId);
            
            if (slotIndex === -1) {
                throw new Error("Slot not found.");
            }
            
            const slot = slots[slotIndex];
            if (slot.bookedBy) {
                throw new Error("This slot has already been booked.");
            }
            
            const newBookingRef = doc(bookingsCollection);

            const newBookingData = {
                courseId,
                courseTitle,
                slotId,
                slotDateTime,
                formData,
                submittedAt: new Date().toISOString(),
            };
            
            transaction.set(newBookingRef, newBookingData);
            
            const studentName = formData['Full Name (EN)'] || formData['name'] || 'Student';
            slots[slotIndex].bookedBy = { name: studentName, bookingId: newBookingRef.id };
            transaction.update(courseRef, { slots });

            return newBookingRef.id;
        });

        return { success: true, bookingId };
    } catch (error: any) {
        console.error("[DB] Error creating booking transaction.", error);
        return { success: false, error: error.message || "Failed to create booking." };
    }
}
