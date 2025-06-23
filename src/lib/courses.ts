import { unstable_noStore as noStore } from 'next/cache';
import type { Course, RegistrationForm } from './types';
import { getDb } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const handleDbError = (context: string) => {
  console.warn(`[DB] ${context}: Firestore is not initialized. This is expected if Firebase environment variables are not set.`);
};

// Provides backward compatibility for courses created before the multi-step form feature
const ensureRegistrationForm = (data: any): RegistrationForm => {
    if (data.registrationForm && Array.isArray(data.registrationForm.steps)) {
        // Ensure steps is not empty for courses that should have a form
        if (data.registrationForm.steps.length > 0) {
            return data.registrationForm;
        }
        // Handle case where a course might have registrationForm: {steps: []} but should have one
        if (data.price?.discounted > 0) {
             return {
                steps: [{
                    id: uuidv4(),
                    name: { en: 'Registration Details', ta: 'பதிவு விவரங்கள்' },
                    fields: [],
                    navigationRules: []
                }]
            };
        }
        return data.registrationForm; // Return the empty steps array for free/non-bookable courses
    }
    // If old structure `formFields` exists, migrate it
    if (Array.isArray(data.formFields)) {
        return {
            steps: [{
                id: uuidv4(),
                name: { en: 'Registration Details', ta: 'பதிவு விவரங்கள்' },
                fields: data.formFields,
                navigationRules: []
            }]
        };
    }
    // Default empty structure
    return {
        steps: []
    };
}


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
    
    const courses: Course[] = [];
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      
      // Production-ready validation: Skip documents that are missing essential fields.
      if (!data.title || !data.title.en || !data.price || typeof data.price.discounted !== 'number') {
          console.warn(`[DB] Skipping malformed course document with ID: ${doc.id}`);
          return;
      }

      const course: Course = {
        id: doc.id,
        title: data.title,
        thumbnail: data.thumbnail || 'https://placehold.co/600x400.png',
        shortDescription: data.shortDescription || { en: '', ta: '' },
        detailedDescription: data.detailedDescription || { en: '', ta: '' },
        whatWeOffer: Array.isArray(data.whatWeOffer) ? data.whatWeOffer : [],
        price: data.price,
        instructions: data.instructions || { en: '', ta: '' },
        youtubeLink: data.youtubeLink || '',
        documentUrl: data.documentUrl || '',
        registrationForm: ensureRegistrationForm(data),
        slots: Array.isArray(data.slots) ? data.slots : [],
      };
      courses.push(course);
    });

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
      const data = docSnap.data();

       if (!data.title || !data.title.en || !data.price || typeof data.price.discounted !== 'number') {
          console.warn(`[DB] Returning undefined for malformed course document with ID: ${docSnap.id}`);
          return undefined;
      }

      const course: Course = {
        id: docSnap.id,
        title: data.title,
        thumbnail: data.thumbnail || 'https://placehold.co/600x400.png',
        shortDescription: data.shortDescription || { en: '', ta: '' },
        detailedDescription: data.detailedDescription || { en: '', ta: '' },
        whatWeOffer: Array.isArray(data.whatWeOffer) ? data.whatWeOffer : [],
        price: data.price,
        instructions: data.instructions || { en: '', ta: '' },
        youtubeLink: data.youtubeLink || '',
        documentUrl: data.documentUrl || '',
        registrationForm: ensureRegistrationForm(data),
        slots: Array.isArray(data.slots) ? data.slots : [],
      };
      return course;
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
    // Sanitize data for Firestore by removing undefined values, which can cause errors.
    const courseData = JSON.parse(JSON.stringify(data));
    const docRef = await addDoc(coursesCollection, courseData);
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
      // Sanitize data for Firestore
      const courseData = JSON.parse(JSON.stringify(data));
      await updateDoc(docRef, courseData);
    }
    return await getCourseById(id);
  } catch (error) {
    console.error(`[DB] Error updating course with ID ${id}. This might be due to Firestore security rules. Please ensure your rules allow write access.`, error);
    throw error;
  }
}

export async function deleteAllCourses(): Promise<{ success: boolean }> {
    const db = getDb();
    if (!db) {
        handleDbError("Deleting all courses");
        throw new Error("Database not initialized.");
    }
    try {
        const coursesCollection = collection(db, 'courses');
        const querySnapshot = await getDocs(coursesCollection);
        if (querySnapshot.empty) {
            return { success: true };
        }
        const batch = writeBatch(db);
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        return { success: true };
    } catch (error) {
        console.error("[DB] Error deleting all courses.", error);
        throw error;
    }
}
