import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache';
import type { Course } from './types';
import { db } from './firebase';

const coursesCollection = collection(db, 'courses');

export async function getCourses(): Promise<Course[]> {
  noStore(); // Opt out of caching
  try {
    console.log('[DB] Attempting to fetch courses...');
    const querySnapshot = await getDocs(coursesCollection);
    const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
    console.log(`[DB] Successfully fetched ${courses.length} courses.`);
    return courses;
  } catch (error) {
    console.error("[DB] Error fetching courses:", error);
    return [];
  }
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  noStore(); // Opt out of caching
  try {
    console.log(`[DB] Attempting to fetch course with ID: ${id}`);
    const docRef = doc(db, 'courses', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(`[DB] Successfully fetched course with ID: ${id}`);
      return { id: docSnap.id, ...docSnap.data() } as Course;
    }
    console.warn(`[DB] No course found with ID: ${id}`);
    return undefined;
  } catch (error) {
    console.error(`[DB] Error fetching course with ID ${id}:`, error);
    return undefined;
  }
}

export async function createCourse(data: Omit<Course, 'id'>): Promise<Course> {
  try {
    console.log('[DB] Attempting to create a new course...');
    const docRef = await addDoc(coursesCollection, data);
    console.log(`[DB] Successfully created new course with ID: ${docRef.id}`);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("[DB] Error creating course:", error);
    throw error; // Re-throw the error to be handled by the server action
  }
}

export async function updateCourse(id: string, data: Partial<Omit<Course, 'id'>>): Promise<Course | undefined> {
  try {
    console.log(`[DB] Attempting to update course with ID: ${id}`);
    const docRef = doc(db, 'courses', id);
    if (Object.keys(data).length > 0) {
      await updateDoc(docRef, data);
    }
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      console.log(`[DB] Successfully updated course with ID: ${id}`);
      return { id: updatedDoc.id, ...updatedDoc.data() } as Course;
    }
    return undefined;
  } catch (error) {
    console.error(`[DB] Error updating course with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteCourse(id: string): Promise<{ success: boolean }> {
  try {
    console.log(`[DB] Attempting to delete course with ID: ${id}`);
    const docRef = doc(db, 'courses', id);
    await deleteDoc(docRef);
    console.log(`[DB] Successfully deleted course with ID: ${id}`);
    return { success: true };
  } catch (error) {
    console.error(`[DB] Error deleting course with ID ${id}:`, error);
    throw error;
  }
}
