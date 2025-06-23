
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

export async function deleteAllDataAction() {
  // Make deletion sequential to prevent potential race conditions
  await deleteAllBookings();
  await deleteAllCourses();
  await deleteAllStudents();

  revalidatePath('/admin/courses');
  revalidatePath('/admin/bookings');
  revalidatePath('/courses');
  revalidatePath('/');
}

export async function seedSampleDataAction() {
  await deleteAllDataAction();

  const step1Id = uuidv4();
  const step2Id = uuidv4();
  const step3Id = uuidv4();
  const vehicleFieldId = uuidv4();

  const sampleCourse = {
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
          id: step1Id,
          name: { en: 'Vehicle Choice', ta: 'வாகனத் தேர்வு' },
          fields: [
            { id: vehicleFieldId, type: 'select' as const, required: true, label: { en: 'Select Vehicle Type', ta: 'வாகன வகையைத் தேர்ந்தெடுக்கவும்' }, options: [{ en: 'Car', ta: 'கார்' }, { en: 'Motorcycle', ta: 'மோட்டார் சைக்கிள்' }] }
          ],
          navigationRules: [
            { fieldId: vehicleFieldId, value: 'Motorcycle', nextStepId: step3Id } // Skip to contact info for motorcycles
          ]
        },
        {
          id: step2Id,
          name: { en: 'License Details', ta: 'உரிம விவரங்கள்' },
          fields: [
            { id: uuidv4(), type: 'text' as const, required: true, label: { en: "Learner's License Number", ta: 'பழகுநர் உரிம எண்' }, placeholder: { en: 'TN-32-A-12345', ta: 'TN-32-A-12345' } }
          ]
        },
        {
          id: step3Id,
          name: { en: 'Contact Information', ta: 'தொடர்பு தகவல்' },
          fields: [
            { id: uuidv4(), type: 'text' as const, required: true, label: { en: 'Full Name', ta: 'முழு பெயர்' }, placeholder: { en: 'Enter your full name', ta: 'உங்கள் முழு பெயரை உள்ளிடவும்' } },
            { id: uuidv4(), type: 'email' as const, required: true, label: { en: 'Email Address', ta: 'மின்னஞ்சல் முகவரி' }, placeholder: { en: 'example@email.com', ta: 'example@email.com' } },
            { id: uuidv4(), type: 'tel' as const, required: true, label: { en: 'Phone Number', ta: 'தொலைபேசி எண்' }, placeholder: { en: '+91 98765 43210', ta: '+91 98765 43210' } },
          ]
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

  await createCourse(sampleCourse);

  revalidatePath('/admin/courses');
  revalidatePath('/admin/bookings');
  revalidatePath('/courses');
  revalidatePath('/');
}
