
import { getDb } from './firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';

const handleDbError = (context: string) => {
    console.warn(`[DB] ${context}: Firestore is not initialized. This is expected if Firebase environment variables are not set.`);
};

export async function deleteAllStudents(): Promise<{ success: boolean }> {
    const db = getDb();
    if (!db) {
        handleDbError("Deleting all students");
        throw new Error("Database not initialized.");
    }
    try {
        const studentsCollection = collection(db, 'students');
        const studentsSnapshot = await getDocs(studentsCollection);
        if (studentsSnapshot.empty) {
            return { success: true };
        }
        const batch = writeBatch(db);
        studentsSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        return { success: true };
    } catch (error) {
        console.error("[DB] Error deleting all students.", error);
        throw error;
    }
}
