
import { unstable_noStore as noStore } from 'next/cache';
import { getDb } from './firebase';
import { collection, getDocs, writeBatch, query, orderBy } from 'firebase/firestore';
import type { Student } from './types';


const handleDbError = (context: string) => {
    console.warn(`[DB] ${context}: Firestore is not initialized. This is expected if Firebase environment variables are not set.`);
};

export async function getStudents(): Promise<Student[]> {
  noStore();
  const db = getDb();
  if (!db) {
    handleDbError("Fetching students");
    return [];
  }
  try {
    const studentsCollection = collection(db, 'students');
    const q = query(studentsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const students: Student[] = [];
    querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        
        if (!data.uid || !data.email || !data.createdAt) {
            console.warn(`[DB] Skipping malformed student document with ID: ${doc.id}`);
            return;
        }

        const student: Student = {
            uid: data.uid,
            email: data.email,
            displayName: data.displayName || 'N/A',
            createdAt: data.createdAt,
        };
        students.push(student);
    });
    return students;
  } catch (error) {
    console.error("[DB] Error fetching students.", error);
    return [];
  }
}

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
