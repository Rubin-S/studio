'use server';

import { revalidatePath } from 'next/cache';
import {
  deleteAllCourses,
  createCourse,
} from '@/lib/courses';
import { deleteAllBookings } from '@/lib/bookings';
import { deleteAllStudents } from '@/lib/students';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays, addMinutes } from 'date-fns';
import type { Course } from '@/lib/types';

export async function deleteAllDataAction() {
  try {
    await deleteAllBookings();
    await deleteAllCourses();
    await deleteAllStudents();

    revalidatePath('/admin/courses');
    revalidatePath('/admin/bookings');
    revalidatePath('/admin/students');
    revalidatePath('/courses');
    revalidatePath('/');
  } catch (error) {
    console.error('A critical error occurred during deleteAllDataAction:', error);
    throw error;
  }
}

export async function seedSampleDataAction() {
  try {
    await deleteAllDataAction();
  } catch (error) {
      console.error('CRITICAL: deleteAllDataAction failed. Aborting seed.', error);
      throw new Error("Seeding failed because data deletion failed. Check server logs.");
  }

  const llrStep1 = uuidv4();
  const llrStep2 = uuidv4();
  const llrField1 = uuidv4();
  
  const generateTimeSlots = () => {
    const slots = [];
    let currentDate = new Date('2025-07-14');
    for (let i = 0; i < 45; i++) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        
        let morningSlotTime = new Date(`${dateStr}T06:00:00`);
        for(let j=0; j<3; j++) {
            const startTime = format(morningSlotTime, 'HH:mm');
            const endTime = format(addMinutes(morningSlotTime, 60), 'HH:mm');
            slots.push({ id: uuidv4(), date: dateStr, startTime, endTime, bookedBy: null });
            morningSlotTime = addMinutes(morningSlotTime, 70); // 60 min lesson + 10 min break
        }
        
        let eveningSlotTime = new Date(`${dateStr}T14:30:00`);
        for(let j=0; j<3; j++) {
            const startTime = format(eveningSlotTime, 'HH:mm');
            const endTime = format(addMinutes(eveningSlotTime, 60), 'HH:mm');
            slots.push({ id: uuidv4(), date: dateStr, startTime, endTime, bookedBy: null });
            eveningSlotTime = addMinutes(eveningSlotTime, 70); // 60 min lesson + 10 min break
        }

        currentDate = addDays(currentDate, 1);
    }
    return slots;
  };


  const carCourse: Omit<Course, 'id'> = {
    title: {
      en: '11-Class One-on-One Private Car Driving Lessons',
      ta: '11-வகுப்பு ஒருவருக்கு ஒருவர் தனியார் கார் ஓட்டுநர் பாடங்கள்',
    },
    thumbnail: 'https://firebasestorage.googleapis.com/v0/b/smds-2025-bbf18.firebasestorage.app/o/Images%2FBook.png?alt=media&token=6e78ca2a-9f68-48f2-8a98-7482871bac78',
    shortDescription: {
      en: 'Get behind the wheel with confidence — safe, skilled, and road-ready in just 11 sessions.',
      ta: 'நம்பிக்கையுடன் சக்கரத்தின் பின்னால் செல்லுங்கள் — பாதுகாப்பான, திறமையான, மற்றும் சாலைக்குத் தயாராக வெறும் 11 அமர்வுகளில்.',
    },
    detailedDescription: {
      en: "Our 11-day Private Car Driving Training Program is perfect for beginners, returning drivers, or anyone looking to improve their skills. Each session is one-on-one with a certified instructor, ensuring personalized attention and faster progress.",
      ta: "எங்கள் 11-நாள் தனியார் கார் ஓட்டுநர் பயிற்சித் திட்டம் ஆரம்பநிலை ஓட்டுநர்கள், மீண்டும் ஓட்டுபவர்கள் அல்லது தங்கள் திறமைகளை மேம்படுத்த விரும்பும் எவருக்கும் ஏற்றது. ஒவ்வொரு அமர்வும் ஒரு சான்றளிக்கப்பட்ட பயிற்றுவிப்பாளருடன் ஒருவருக்கு ஒருவர் நடைபெறுகிறது, இது தனிப்பயனாக்கப்பட்ட கவனத்தையும் வேகமான முன்னேற்றத்தையும் உறுதி செய்கிறது.",
    },
    whatWeOffer: [
      { en: 'Tailored 1-on-1 instruction', ta: 'தனிப்பயனாக்கப்பட்ட 1-க்கு-1 அறிவுறுத்தல்' },
      { en: 'Flexible scheduling with six slots per day', ta: 'ஒரு நாளைக்கு ஆறு நேரங்களுடன் நெகிழ்வான திட்டமிடல்' },
      { en: 'Build confidence and practical skills quickly', ta: 'நம்பிக்கையையும் நடைமுறைத் திறன்களையும் விரைவாக உருவாக்குங்கள்' },
      { en: 'Progress from beginner to advanced in 11 days', ta: '11 நாட்களில் ஆரம்பநிலையிலிருந்து மேம்பட்ட நிலைக்கு முன்னேறுங்கள்' },
    ],
    price: { original: 11000, discounted: 10000 },
    instructions: {
      en: "Please bring a valid form of identification. If you possess a Learner's License (LLR), please bring it to your first class.",
      ta: 'தயவுசெய்து செல்லுபடியாகும் அடையாள அட்டையைக் கொண்டு வாருங்கள். உங்களிடம் பழகுநர் உரிமம் (LLR) இருந்தால், அதை உங்கள் முதல் வகுப்பிற்கு கொண்டு வாருங்கள்.',
    },
    youtubeLink: '',
    documentUrl: 'https://docs.google.com/document/d/1Nij2NJwjaohHZYvHEPIORwb_8_3cigB1IdmddikmJ-s/edit?usp=sharing',
    registrationForm: {
      steps: [
        {
          id: llrStep1,
          name: { en: 'Personal Details', ta: 'தனிப்பட்ட விபரங்கள்' },
          fields: [
            { id: uuidv4(), type: 'text', required: true, label: { en: 'Name', ta: 'பெயர்' }, placeholder: { en: 'eg: Ganesh', ta: 'எ.கா: கணேஷ்' }, options: [] },
            { id: uuidv4(), type: 'date', required: true, label: { en: 'Date of birth', ta: 'பிறந்த தேதி' }, placeholder: { en: 'DD-MM-YYYY', ta: 'DD-MM-YYYY' }, options: [] },
            { id: uuidv4(), type: 'text', required: true, label: { en: 'Residential City/Town/Village', ta: 'குடியிருப்பு நகரம்/நகரம்/கிராமம்' }, placeholder: { en: 'Thiyagadurgam', ta: 'தியாகதுருகம்' }, options: [] },
            { id: uuidv4(), type: 'tel', required: true, label: { en: 'Phone Number', ta: 'தொலைபேசி எண்' }, placeholder: { en: 'eg: 98xxxxxxxx', ta: 'எ.கா: 98xxxxxxxx' }, options: [] },
            { id: uuidv4(), type: 'email', required: true, label: { en: 'Email', ta: 'மின்னஞ்சல்' }, placeholder: { en: 'example@abc.com', ta: 'example@abc.com' }, options: [] },
            { id: llrField1, type: 'select', required: true, label: { en: "Do you already have LLR?", ta: 'உங்களிடம் ஏற்கனவே LLR உள்ளதா?' }, placeholder: { en: 'Please select an option', ta: 'ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்' }, options: [{ en: 'Yes', ta: 'ஆம்' }, { en: 'No', ta: 'இல்லை' }] }
          ],
           navigationRules: [
            { fieldId: llrField1, value: 'Yes', nextStepId: uuidv4() } // No next step for Yes, effectively ending form
          ]
        },
        {
          id: llrStep2,
          name: { en: 'LLR Assistance', ta: 'LLR உதவி' },
          fields: [
            { id: uuidv4(), type: 'text', required: true, label: { en: "Aadhar Card Number", ta: 'ஆதார் அட்டை எண்' }, placeholder: { en: 'xxxx xxxx xxxx xxxx', ta: 'xxxx xxxx xxxx xxxx' }, options: [] },
            { id: uuidv4(), type: 'tel', required: true, label: { en: "Phone Number linked with Aadhar Card", ta: 'ஆதார் அட்டையுடன் இணைக்கப்பட்ட தொலைபேசி எண்' }, placeholder: { en: 'eg: 98xxxxxxxx', ta: 'எ.கா: 98xxxxxxxx' }, options: [] }
          ],
          navigationRules: [],
        },
      ]
    },
    slots: generateTimeSlots(),
  };

  const bikeCourse: Omit<Course, 'id'> = {
    title: { en: 'Two-Wheeler License', ta: 'இரு சக்கர வாகன உரிமம்' },
    thumbnail: 'https://placehold.co/600x400.png',
    shortDescription: { en: 'Get your two-wheeler license with our specialized training program.', ta: 'எங்கள் சிறப்புப் பயிற்சித் திட்டத்துடன் உங்கள் இரு சக்கர வாகன உரிமத்தைப் பெறுங்கள்.' },
    detailedDescription: { en: 'This course is focused on getting you comfortable and safe on a two-wheeler, preparing you for the RTO test and beyond. Includes practical training and license assistance.', ta: 'இந்த பாடநெறி உங்களை இரு சக்கர வாகனத்தில் வசதியாகவும் பாதுகாப்பாகவும் மாற்றுவதில் கவனம் செலுத்துகிறது, இது உங்களை ஆர்டிஓ சோதனைக்கும் அதற்கு அப்பாலும் தயார்படுத்துகிறது. இதில் நடைமுறைப் பயிற்சி மற்றும் உரிம உதவியும் அடங்கும்.' },
    whatWeOffer: [
      { en: '10 Training Sessions', ta: '10 பயிற்சி அமர்வுகள்' },
      { en: 'RTO Test Vehicle Provided', ta: 'RTO சோதனை வாகனம் வழங்கப்படும்' },
      { en: 'Safety Gear Guidance', ta: 'பாதுகாப்பு உபகரண வழிகாட்டுதல்' },
    ],
    price: { original: 1000, discounted: 1 },
    instructions: { en: 'Aadhar card is mandatory for application.', ta: 'விண்ணப்பத்திற்கு ஆதார் அட்டை கட்டாயம்.' },
    youtubeLink: '',
    documentUrl: '',
    registrationForm: {
      steps: [{
        id: uuidv4(),
        name: { en: 'Applicant Details', ta: 'விண்ணப்பதாரர் விவரங்கள்' },
        fields: [
            { id: uuidv4(), type: 'text', required: true, label: { en: 'Full Name', ta: 'முழு பெயர்' }, placeholder: { en: 'Enter your full name', ta: 'உங்கள் முழு பெயரை உள்ளிடவும்' }, options: [] },
            { id: uuidv4(), type: 'email', required: true, label: { en: 'Email Address', ta: 'மின்னஞ்சல் முகவரி' }, placeholder: { en: 'example@email.com', ta: 'example@email.com' }, options: [] },
            { id: uuidv4(), type: 'tel', required: true, label: { en: 'Phone Number', ta: 'தொலைபேசி எண்' }, placeholder: { en: '+91 98765 43210', ta: '+91 98765 43210' }, options: [] },
        ],
        navigationRules: []
      }]
    },
    slots: [
        { id: uuidv4(), date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), startTime: '14:00', endTime: '15:00', bookedBy: null },
        { id: uuidv4(), date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), startTime: '14:00', endTime: '15:00', bookedBy: null },
    ],
  };

  const theoryCourse: Omit<Course, 'id'> = {
    title: { en: 'Free Theory Class', ta: 'இலவச கோட்பாட்டு வகுப்பு' },
    thumbnail: 'https://placehold.co/600x400.png',
    shortDescription: { en: 'Join our free online theory class to learn the rules of the road.', ta: 'சாலை விதிகளை அறிய எங்கள் இலவச ஆன்லைன் கோட்பாட்டு வகுப்பில் சேரவும்.' },
    detailedDescription: { en: 'This free class covers all the essential traffic rules, signals, and road safety measures required to pass the theoretical part of the driving test. This is a knowledge-only course.', ta: 'இந்த இலவச வகுப்பு, ஓட்டுநர் தேர்வின் கோட்பாட்டுப் பகுதியில் தேர்ச்சி பெறத் தேவையான அனைத்து அத்தியாவசிய போக்குவரத்து விதிகள், சிக்னல்கள் மற்றும் சாலைப் பாதுகாப்பு நடவடிக்கைகள் ஆகியவற்றை உள்ளடக்கியது. இது அறிவுக்கான பாடநெறி மட்டுமே.' },
    whatWeOffer: [
      { en: '1-hour Online Session', ta: '1 மணி நேர ஆன்லைன் அமர்வு' },
      { en: 'Covers all RTO Signals', ta: 'அனைத்து RTO சிக்னல்களையும் உள்ளடக்கியது' },
      { en: 'Q&A with Instructor', ta: 'பயிற்றுவிப்பாளருடன் கேள்வி பதில்' },
    ],
    price: { original: 500, discounted: 0 },
    instructions: { en: 'This is a service and does not require booking. The course fee is 0.', ta: 'இது ஒரு சேவையாகும், முன்பதிவு தேவையில்லை. பாடநெறி கட்டணம் 0 ஆகும்.' },
    youtubeLink: '',
    documentUrl: '',
    registrationForm: { steps: [] },
    slots: [],
  };

  try {
    await createCourse(carCourse);
    await createCourse(bikeCourse);
    await createCourse(theoryCourse);
  } catch (error) {
    console.error('A critical error occurred during the course creation phase of seeding:', error);
    throw new Error("Seeding failed during course creation. Check server logs for which course failed and why.");
  }


  revalidatePath('/admin/courses');
  revalidatePath('/admin/bookings');
  revalidatePath('/courses');
  revalidatePath('/');
}
