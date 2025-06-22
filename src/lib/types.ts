export type Course = {
  id: string;
  title: { en: string; ta: string };
  thumbnail: string;
  shortDescription: { en: string; ta: string };
  detailedDescription: { en: string; ta: string };
  whatWeOffer: { en: string; ta: string }[];
  price: {
    original: number;
    discounted: number;
  };
  instructions: { en: string; ta: string };
  youtubeLink?: string;
  documentUrl?: string; // For PDF/Image
  googleCalendarLink?: string;
  googleFormLink?: string;
};
