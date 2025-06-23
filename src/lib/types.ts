export type LocalizedString = {
  en: string;
  ta: string;
};

export type FormField = {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  label: LocalizedString;
  placeholder?: LocalizedString;
  required: boolean;
  options?: LocalizedString[];
};

export type CourseSlot = {
  id: string;
  dateTime: string; // ISO 8601 format
  bookedBy: {
    name: string;
    bookingId: string;
  } | null;
};

export type Course = {
  id: string;
  title: LocalizedString;
  thumbnail: string;
  shortDescription: LocalizedString;
  detailedDescription: LocalizedString;
  whatWeOffer: LocalizedString[];
  price: {
    original: number;
    discounted: number;
  };
  instructions: LocalizedString;
  youtubeLink?: string;
  documentUrl?: string; // For PDF/Image
  formFields: FormField[];
  slots: CourseSlot[];
};

export type Booking = {
  id: string;
  courseId: string;
  courseTitle: string;
  slotId: string;
  slotDateTime: string;
  formData: { [key: string]: string };
  submittedAt: string; // ISO 8601 format
};
