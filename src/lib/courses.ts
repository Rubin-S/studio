import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache';
import type { Course } from './types';
import { db } from './firebase';

const coursesCollection = collection(db, 'courses');

export async function getCourses(): Promise<Course[]> {
  noStore(); // Opt out of caching
  const querySnapshot = await getDocs(coursesCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  noStore(); // Opt out of caching
  const docRef = doc(db, 'courses', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Course;
  }
  return undefined;
}

export async function createCourse(data: Omit<Course, 'id'>): Promise<Course> {
  const docRef = await addDoc(coursesCollection, data);
  return { id: docRef.id, ...data };
}

export async function updateCourse(id: string, data: Partial<Omit<Course, 'id'>>): Promise<Course | undefined> {
  const docRef = doc(db, 'courses', id);
  if (Object.keys(data).length > 0) {
    await updateDoc(docRef, data);
  }
  const updatedDoc = await getDoc(docRef);
  if (updatedDoc.exists()) {
    return { id: updatedDoc.id, ...updatedDoc.data() } as Course;
  }
  return undefined;
}

export async function deleteCourse(id: string): Promise<{ success: boolean }> {
  const docRef = doc(db, 'courses', id);
  await deleteDoc(docRef);
  return { success: true };
}
