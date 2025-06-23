import { unstable_noStore as noStore } from 'next/cache';
import type { Course } from './types';
import { getDb } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const handleDbError = (context: string) => {
  console.warn(`[DB] ${context}: Firestore is not initialized. This is expected if Firebase environment variables are not set.`);
};

export async function getCourses(): Promise<Course[]> {
  noStore();
  const db = getDb();
  if (!db) {
    handleDbError("Fetching courses");
    return [];
  }
  try {
    const coursesCollection = collection(db, 'courses');
    const querySnapshot = await getDocs(coursesCollection);
    const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
    return courses;
  } catch (error) {
    console.error("[DB] Error fetching courses. This might be due to Firestore security rules.", error);
    return [];
  }
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  noStore();
  const db = getDb();
  if (!db) {
    handleDbError(`Fetching course with ID ${id}`);
    return undefined;
  }
  try {
    const docRef = doc(db, 'courses', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Course;
    }
    return undefined;
  } catch (error) {
    console.error(`[DB] Error fetching course with ID ${id}. This might be due to Firestore security rules.`, error);
    return undefined;
  }
}

export async function createCourse(data: Omit<Course, 'id'>): Promise<Course> {
  const db = getDb();
  if (!db) {
    handleDbError("Creating course");
    throw new Error("Database not initialized.");
  }
  try {
    const coursesCollection = collection(db, 'courses');
    const docRef = await addDoc(coursesCollection, data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("[DB] Error creating course. This might be due to Firestore security rules. Please ensure your rules allow write access.", error);
    throw error;
  }
}

export async function updateCourse(id: string, data: Partial<Omit<Course, 'id'>>): Promise<Course | undefined> {
  const db = getDb();
  if (!db) {
    handleDbError(`Updating course with ID ${id}`);
    throw new Error("Database not initialized.");
  }
  try {
    const docRef = doc(db, 'courses', id);
    if (Object.keys(data).length > 0) {
      await updateDoc(docRef, data);
    }
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      return { id: updatedDoc.id, ...updatedDoc.data() } as Course;
    }
    return undefined;
  } catch (error) {
    console.error(`[DB] Error updating course with ID ${id}. This might be due to Firestore security rules. Please ensure your rules allow write access.`, error);
    throw error;
  }
}

export async function deleteCourse(id: string): Promise<{ success: boolean }> {
  const db = getDb();
  if (!db) {
    handleDbError(`Deleting course with ID ${id}`);
    throw new Error("Database not initialized.");
  }
  try {
    const docRef = doc(db, 'courses', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error(`[DB] Error deleting course with ID ${id}. This might be due to Firestore security rules. Please ensure your rules allow delete access.`, error);
    throw error;
  }
}
