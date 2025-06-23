'use server';

import { revalidatePath } from 'next/cache';
import {
  deleteAllCourses,
  createCourse,
} from '@/lib/courses';
import { deleteAllBookings } from '@/lib/bookings';
import { deleteAllStudents } from '@/lib/students';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays } from 'date-fns';
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

  const carStep1 = uuidv4();
  const carStep2 = uuidv4();
  const carStep3 = uuidv4();
  const carField1 = uuidv4();

  const carCourse: Omit<Course, 'id'> = {
    title: {
      en: 'Comprehensive Car Training',
      ta: 'விரிவான கார் பயிற்சி',
    },
    thumbnail: 'https://placehold.co/600x400.png',
    shortDescription: {
      en: 'Master driving with our comprehensive course covering theory and practical skills.',
      ta: 'கோட்பாடு மற்றும் நடைமுறை திறன்களை உள்ளடக்கிய எங்கள் விரிவான பாடத்திட்டத்துடன் ஓட்டுவதில் தேர்ச்சி பெறுங்கள்.',
    },
    detailedDescription: {
      en: 'Our most popular course is designed to make you a confident and safe driver. We cover all aspects of driving, from understanding vehicle controls to navigating complex traffic situations. The course concludes with preparation for your RTO test.',
      ta: 'எங்களின் மிகவும் பிரபலமான பாடநெறி உங்களை நம்பிக்கையுடனும் பாதுகாப்பாகவும் ஓட்டுநராக மாற்றுவதற்காக வடிவமைக்கப்பட்டுள்ளது. வாகனக் கட்டுப்பாடுகளைப் புரிந்துகொள்வது முதல் சிக்கலான போக்குவரத்துச் சூழல்களைக் கையாள்வது வரை, வாகனம் ஓட்டுவதன் அனைத்து அம்சங்களையும் நாங்கள் உள்ளடக்குகிறோம். இந்த பாடநெறி உங்கள் RTO சோதனைக்கான தயாரிப்புடன் முடிவடைகிறது.',
    },
    whatWeOffer: [
      { en: '15 Driving Sessions (1hr each)', ta: '15 ஓட்டுநர் அமர்வுகள் (தலா 1 மணி நேரம்)' },
      { en: 'Full RTO License Assistance', ta: 'முழு RTO உரிம உதவி' },
      { en: 'Expert, Patient Instructors', ta: 'நிபுணர், பொறுமையான பயிற்றுனர்கள்' },
      { en: 'Modern Training Vehicles', ta: 'நவீன பயிற்சி வாகனங்கள்' },
    ],
    price: { original: 8000, discounted: 7500 },
    instructions: {
      en: "Please bring your Learner's License (LLR) and Aadhar card for verification to the first class.",
      ta: 'முதல் வகுப்பிற்கு சரிபார்ப்புக்காக உங்கள் ஓட்டுநர் உரிமம் (LLR) மற்றும் ஆதார் அட்டையை கொண்டு வரவும்.',
    },
    youtubeLink: 'https://www.youtube.com/embed/videoseries?list=PLgY5_1Zg0hAQ_c64D8s-wkw_p26c-g4-B',
    documentUrl: '',
    registrationForm: {
      steps: [
        {
          id: carStep1,
          name: { en: 'Personal Details', ta: 'தனிப்பட்ட விபரங்கள்' },
          fields: [
            { id: uuidv4(), type: 'text', required: true, label: { en: 'Full Name', ta: 'முழு பெயர்' }, placeholder: { en: 'Enter your full name', ta: 'உங்கள் முழு பெயரை உள்ளிடவும்' }, options: [] },
            { id: carField1, type: 'select', required: true, label: { en: 'Have LLR?', ta: 'LLR உள்ளதா?' }, placeholder: { en: 'Please select an option', ta: 'ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்' }, options: [{ en: 'Yes', ta: 'ஆம்' }, { en: 'No', ta: 'இல்லை' }] }
          ],
           navigationRules: [
            { fieldId: carField1, value: 'No', nextStepId: carStep3 }
          ]
        },
        {
          id: carStep2,
          name: { en: 'License Details', ta: 'உரிம விவரங்கள்' },
          fields: [
            { id: uuidv4(), type: 'text', required: true, label: { en: "Learner's License Number", ta: 'பழகுநர் உரிம எண்' }, placeholder: { en: 'TN-32-A-12345', ta: 'TN-32-A-12345' }, options: [] }
          ],
          navigationRules: [],
        },
        {
          id: carStep3,
          name: { en: 'Contact Information', ta: 'தொடர்பு தகவல்' },
          fields: [
            { id: uuidv4(), type: 'email', required: true, label: { en: 'Email Address', ta: 'மின்னஞ்சல் முகவரி' }, placeholder: { en: 'example@email.com', ta: 'example@email.com' }, options: [] },
            { id: uuidv4(), type: 'tel', required: true, label: { en: 'Phone Number', ta: 'தொலைபேசி எண்' }, placeholder: { en: '+91 98765 43210', ta: '+91 98765 43210' }, options: [] },
          ],
          navigationRules: [],
        }
      ]
    },
    slots: [
      { id: uuidv4(), date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), startTime: '09:00', endTime: '10:00', bookedBy: null },
      { id: uuidv4(), date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), startTime: '10:00', endTime: '11:00', bookedBy: null },
      { id: uuidv4(), date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), startTime: '09:00', endTime: '10:00', bookedBy: null },
      { id: uuidv4(), date: format(addDays(new Date(), 3), 'yyyy-MM-dd'), startTime: '11:00', endTime: '12:00', bookedBy: null },
    ],
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
