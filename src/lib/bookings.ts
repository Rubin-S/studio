import { unstable_noStore as noStore } from 'next/cache';
import type { Booking } from './types';
import { getDb } from './firebase';
import { collection, getDocs, query, orderBy, doc, runTransaction, writeBatch, updateDoc, where } from 'firebase/firestore';

const handleDbError = (context: string) => {
  console.warn(`[DB] ${context}: Firestore is not initialized. This is expected if Firebase environment variables are not set.`);
};

export async function getBookings(): Promise<Booking[]> {
  noStore();
  const db = getDb();
  if (!db) {
    handleDbError("Fetching bookings");
    return [];
  }
  try {
    const bookingsCollection = collection(db, 'bookings');
    const q = query(bookingsCollection, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const bookings: Booking[] = [];
    querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        
        // Production-ready validation: Skip documents missing essential fields.
        if (!data.userId || !data.courseId || !data.slotDate || !data.submittedAt) {
            console.warn(`[DB] Skipping malformed booking document with ID: ${doc.id}`);
            return;
        }

        const booking: Booking = {
            id: doc.id,
            userId: data.userId,
            courseId: data.courseId,
            courseTitle: data.courseTitle || 'Unknown Course',
            slotId: data.slotId || 'N/A',
            slotDate: data.slotDate,
            slotStartTime: data.slotStartTime || 'N/A',
            slotEndTime: data.slotEndTime || 'N/A',
            formData: data.formData && typeof data.formData === 'object' ? data.formData : {},
            submittedAt: data.submittedAt,
            transactionId: data.transactionId || '',
            paymentVerified: data.paymentVerified === true,
        };
        bookings.push(booking);
    });
    return bookings;
  } catch (error) {
    console.error("[DB] Error fetching bookings. This might be due to Firestore security rules.", error);
    return [];
  }
}

export async function getBookingsByUserId(userId: string): Promise<Booking[]> {
  noStore();
  const db = getDb();
  if (!db) {
    handleDbError("Fetching user bookings");
    return [];
  }
  if (!userId) return [];
  try {
    const bookingsCollection = collection(db, 'bookings');
    const q = query(bookingsCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const bookings: Booking[] = [];
    querySnapshot.docs.forEach(doc => {
        const data = doc.data();

        // Production-ready validation: Skip documents missing essential fields.
        if (!data.userId || !data.courseId || !data.slotDate || !data.submittedAt) {
            console.warn(`[DB] Skipping malformed booking document with ID: ${doc.id} for user ${userId}`);
            return; // Skip this invalid document
        }

        const booking: Booking = {
            id: doc.id,
            userId: data.userId,
            courseId: data.courseId,
            courseTitle: data.courseTitle || 'Unknown Course',
            slotId: data.slotId || 'N/A',
            slotDate: data.slotDate,
            slotStartTime: data.slotStartTime || 'N/A',
            slotEndTime: data.slotEndTime || 'N/A',
            formData: data.formData && typeof data.formData === 'object' ? data.formData : {},
            submittedAt: data.submittedAt,
            transactionId: data.transactionId || '',
            paymentVerified: data.paymentVerified === true,
        };
        bookings.push(booking);
    });
    
    // Sort manually since we removed it from the query to avoid needing a composite index
    bookings.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return bookings;
  } catch (error) {
    console.error(`[DB] Error fetching bookings for user ${userId}.`, error);
    return [];
  }
}

export async function createBooking(
  userId: string,
  courseId: string,
  courseTitle: string,
  slot: { id: string; date: string; startTime: string; endTime: string },
  formData: { [key: string]: string },
  transactionId: string,
): Promise<{ success: boolean; bookingId?: string; error?: string }> {
    const db = getDb();
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
            const slotIndex = slots.findIndex((s: { id: string; }) => s.id === slot.id);
            
            if (slotIndex === -1) {
                throw new Error("Slot not found.");
            }
            
            const currentSlot = slots[slotIndex];
            if (currentSlot.bookedBy) {
                throw new Error("This slot has already been booked.");
            }
            
            const newBookingRef = doc(bookingsCollection);

            const newBookingData = {
                userId,
                courseId,
                courseTitle,
                slotId: slot.id,
                slotDate: slot.date,
                slotStartTime: slot.startTime,
                slotEndTime: slot.endTime,
                formData,
                submittedAt: new Date().toISOString(),
                transactionId,
                paymentVerified: false,
            };
            
            transaction.set(newBookingRef, newBookingData);
            
            const studentName = formData['Full Name'] || formData['Name'] || 'Student';
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


export async function deleteAllBookings(): Promise<{ success: boolean }> {
    const db = getDb();
    if (!db) {
        handleDbError("Deleting all bookings");
        throw new Error("Database not initialized.");
    }
    try {
        const bookingsCollection = collection(db, 'bookings');
        const bookingsSnapshot = await getDocs(bookingsCollection);
         if (bookingsSnapshot.empty) {
            return { success: true };
        }
        const deleteBatch = writeBatch(db);
        bookingsSnapshot.docs.forEach((doc) => {
            deleteBatch.delete(doc.ref);
        });
        await deleteBatch.commit();

        return { success: true };
    } catch (error) {
        console.error("[DB] Error deleting all bookings.", error);
        throw error;
    }
}
