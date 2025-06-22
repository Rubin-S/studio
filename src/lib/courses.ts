import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache';
import type { Course } from './types';
import { db } from './firebase';

const coursesCollection = collection(db, 'courses');

// A sample course to seed the database if it's empty.
const initialCourse: Omit<Course, 'id'> = {
  title: { en: 'Comprehensive Car Driving Course', ta: 'விரிவான கார் ஓட்டுநர் பயிற்சி' },
  thumbnail: 'https://placehold.co/600x400.png',
  shortDescription: { 
    en: 'Master the art of driving with our complete 30-day program.',
    ta: 'எங்களின் முழுமையான 30-நாள் திட்டத்துடன் ஓட்டும் கலையில் தேர்ச்சி பெறுங்கள்.'
  },
  detailedDescription: {
    en: 'Our flagship course covers everything a new driver needs to know. From understanding the vehicle basics to mastering complex road situations, our experienced instructors will guide you every step of the way. The course includes both theoretical classes and extensive practical sessions to build your confidence and skills.',
    ta: 'எங்களின் முதன்மை பாடநெறி ஒரு புதிய ஓட்டுநருக்குத் தேவையான அனைத்தையும் உள்ளடக்கியது. வாகனத்தின் அடிப்படைகளைப் புரிந்துகொள்வது முதல் சிக்கலான சாலை சூழ்நிலைகளில் தேர்ச்சி பெறுவது வரை, எங்கள் அனுபவம் வாய்ந்த பயிற்றுனர்கள் உங்களுக்கு ஒவ்வொரு படியிலும் வழிகாட்டுவார்கள். உங்கள் தன்னம்பிக்கையையும் திறமையையும் வளர்க்க, பாடத்திட்டத்தில் கோட்பாட்டு வகுப்புகள் மற்றும் விரிவான நடைமுறை அமர்வுகள் இரண்டும் அடங்கும்.'
  },
  whatWeOffer: [
    { en: 'One-on-One Training', ta: 'ஒருவருக்கு ஒருவர் பயிற்சி' },
    { en: 'Flexible Timings', ta: 'நெகிழ்வான நேரங்கள்' },
    { en: 'In-depth Theory Classes', ta: 'ஆழமான கோட்பாட்டு வகுப்புகள்' },
    { en: 'RTO Test Practice', ta: 'RTO தேர்வு பயிற்சி' },
    { en: 'Modern Training Vehicles', ta: 'நவீன பயிற்சி வாகனங்கள்' },
  ],
  price: {
    original: 7500,
    discounted: 6000
  },
  instructions: {
    en: 'Please bring a valid identity proof and two passport-sized photos for registration. All learning materials will be provided.',
    ta: 'பதிவுக்காக சரியான அடையாளச் சான்று மற்றும் இரண்டு பாஸ்போர்ட் அளவு புகைப்படங்களைக் கொண்டு வரவும். அனைத்து கற்றல் பொருட்களும் வழங்கப்படும்.'
  },
  youtubeLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  googleCalendarLink: 'https://calendar.google.com/calendar/embed?src=en.indian%23holiday%40group.v.calendar.google.com&ctz=Asia%2FKolkata',
  googleFormLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdw7QzaP2hG4F7w2Yd_cR7D0iA_bKvJ8aP9xW8eL9T0uR3c_A/viewform?embedded=true',
};

export async function getCourses(): Promise<Course[]> {
  noStore(); // Opt out of caching
  const querySnapshot = await getDocs(coursesCollection);
  
  if (querySnapshot.empty) {
    // Seed the database with the initial course if it's empty
    await addDoc(coursesCollection, initialCourse);
    const newSnapshot = await getDocs(coursesCollection);
    return newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  }
  
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
