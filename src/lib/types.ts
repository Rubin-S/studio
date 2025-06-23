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

export type NavigationRule = {
  fieldId: string; // ID of the field that triggers this rule
  value: string; // The English value of the option to match
  nextStepId: string; // The ID of the step to navigate to
};

export type FormStep = {
  id: string;
  name: LocalizedString;
  fields: FormField[];
  navigationRules?: NavigationRule[];
};

export type RegistrationForm = {
  steps: FormStep[];
};

export type CourseSlot = {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
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
  documentUrl?: string;
  registrationForm: RegistrationForm;
  slots: CourseSlot[];
};

export type Booking = {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  slotId: string;
  slotDate: string;
  slotStartTime: string;
  slotEndTime: string;
  formData: { [key: string]: string };
  submittedAt: string; // ISO 8601 format
  transactionId: string;
  paymentVerified: boolean;
};
