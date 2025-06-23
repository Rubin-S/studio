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
    if (data.registrationForm && Array.isArray(data.registrationForm.steps) && data.registrationForm.steps.length > 0) {
        return data.registrationForm;
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
        steps: [{
            id: uuidv4(),
            name: { en: 'Step 1', ta: 'படி 1' },
            fields: [],
            navigationRules: []
        }]
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
    
    const courses = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const course: Course = {
        id: doc.id,
        title: data.title || { en: 'Untitled Course', ta: 'பெயரிடப்படாத படிப்பு' },
        thumbnail: data.thumbnail || 'https://placehold.co/600x400.png',
        shortDescription: data.shortDescription || { en: '', ta: '' },
        detailedDescription: data.detailedDescription || { en: '', ta: '' },
        whatWeOffer: Array.isArray(data.whatWeOffer) ? data.whatWeOffer : [],
        price: data.price && typeof data.price.original === 'number' && typeof data.price.discounted === 'number'
          ? data.price
          : { original: 0, discounted: 0 },
        instructions: data.instructions || { en: '', ta: '' },
        youtubeLink: data.youtubeLink || '',
        documentUrl: data.documentUrl || '',
        registrationForm: ensureRegistrationForm(data),
        slots: Array.isArray(data.slots) ? data.slots : [],
      };
      return course;
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
      const course: Course = {
        id: docSnap.id,
        title: data.title || { en: 'Untitled Course', ta: 'பெயரிடப்படாத படிப்பு' },
        thumbnail: data.thumbnail || 'https://placehold.co/600x400.png',
        shortDescription: data.shortDescription || { en: '', ta: '' },
        detailedDescription: data.detailedDescription || { en: '', ta: '' },
        whatWeOffer: Array.isArray(data.whatWeOffer) ? data.whatWeOffer : [],
        price: data.price && typeof data.price.original === 'number' && typeof data.price.discounted === 'number'
          ? data.price
          : { original: 0, discounted: 0 },
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
    // Remove the old formFields if it exists, to avoid data duplication
    const { formFields, ...restData } = data as any;
    const docRef = await addDoc(coursesCollection, restData);
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
      // Remove the old formFields if it exists, to avoid data duplication
      const { formFields, ...restData } = data as any;
      await updateDoc(docRef, restData);
    }
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      const docData = updatedDoc.data()
      return { 
          id: updatedDoc.id,
          ...docData,
          registrationForm: ensureRegistrationForm(docData)
      } as Course;
    }
    return undefined;
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
