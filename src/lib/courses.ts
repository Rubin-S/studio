import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache';
import type { Course } from './types';
import { db } from './firebase';

const coursesCollection = collection(db, 'courses');

export async function getCourses(): Promise<Course[]> {
  noStore(); // Opt out of caching
  try {
    const querySnapshot = await getDocs(coursesCollection);

    // If the collection is empty, seed it with one course for demonstration
    if (querySnapshot.empty) {
      const seedData = {
        title: { en: 'Comprehensive Car Training', ta: 'விரிவான கார் பயிற்சி' },
        thumbnail: 'https://placehold.co/600x400.png',
        shortDescription: {
          en: 'Learn to drive a car with our comprehensive, 30-day training program.',
          ta: 'எங்கள் விரிவான, 30-நாள் பயிற்சித் திட்டத்தின் மூலம் கார் ஓட்டக் கற்றுக்கொள்ளுங்கள்.',
        },
        detailedDescription: {
          en: 'Our 30-day comprehensive car training course covers everything from the basics of vehicle operation to advanced defensive driving techniques. Suitable for all learners.',
          ta: 'எங்களின் 30-நாள் விரிவான கார் பயிற்சி பாடநெறி, வாகன செயல்பாட்டின் அடிப்படைகள் முதல் மேம்பட்ட தற்காப்பு ஓட்டுநர் நுட்பங்கள் வரை அனைத்தையும் உள்ளடக்கியது. அனைத்து கற்பவர்களுக்கும் ஏற்றது.',
        },
        whatWeOffer: [
          { en: '30 Days of Training', ta: '30 நாட்கள் பயிற்சி' },
          { en: 'Flexible Timings', ta: 'நெகிழ்வான நேரங்கள்' },
          { en: 'Expert Instructors', ta: 'நிபுணர் பயிற்றுனர்கள்' },
          { en: 'RTO License Assistance', ta: 'RTO உரிமம் உதவி' },
        ],
        price: { original: 8000, discounted: 7500 },
        instructions: {
          en: 'Please bring your Learners License (LLR) and a passport-sized photograph on the first day of class.',
          ta: 'வகுப்பின் முதல் நாளில் உங்கள் ஓட்டுநர் உரிமம் (LLR) மற்றும் பாஸ்போர்ட் அளவு புகைப்படத்தை கொண்டு வரவும்.',
        },
        youtubeLink: '',
        documentUrl: '',
        googleCalendarLink: '',
        googleFormLink: '',
      };
      const docRef = await addDoc(coursesCollection, seedData);
      // Return the newly created course in the correct format immediately
      return [{ ...seedData, id: docRef.id } as Course];
    }


    const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
    return courses;
  } catch (error) {
    console.error("[DB] Error fetching courses. This might be due to Firestore security rules. Please ensure your rules allow read/write access to the 'courses' collection.", error);
    return [];
  }
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  noStore(); // Opt out of caching
  try {
    const docRef = doc(db, 'courses', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Course;
    }
    return undefined;
  } catch (error) {
    console.error(`[DB] Error fetching course with ID ${id}. This might be due to Firestore security rules. Please ensure your rules allow read access.`, error);
    return undefined;
  }
}

export async function createCourse(data: Omit<Course, 'id'>): Promise<Course> {
  try {
    const docRef = await addDoc(coursesCollection, data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("[DB] Error creating course. This might be due to Firestore security rules. Please ensure your rules allow write access.", error);
    throw error; // Re-throw the error to be handled by the server action
  }
}

export async function updateCourse(id: string, data: Partial<Omit<Course, 'id'>>): Promise<Course | undefined> {
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
  try {
    const docRef = doc(db, 'courses', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error(`[DB] Error deleting course with ID ${id}. This might be due to Firestore security rules. Please ensure your rules allow delete access.`, error);
    throw error;
  }
}
