import type { Metadata } from 'next';
import { Inter, Poppins, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const fontHeadline = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-headline',
});

const fontCode = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-code',
});

export const metadata: Metadata = {
  title: {
    template: '%s | SMDS - Sri Senthil Murugan Driving School',
    default: 'SMDS - Sri Senthil Murugan Driving School',
  },
  description: 'The premier driving school in Thiyagadurgam, Kallakurichi. We offer comprehensive car training and license assistance with expert instructors. Your journey to safe and confident driving starts here.',
  keywords: ['driving school', 'Thiyagadurgam', 'Kallakurichi', 'learn to drive', 'car training', 'driving lessons', 'RTO license'],
  openGraph: {
    title: 'SMDS - Sri Senthil Murugan Driving School',
    description: 'The premier driving school in Thiyagadurgam, Kallakurichi.',
    siteName: 'Sri Senthil Murugan Driving School',
    images: [
      {
        url: 'https://img.freepik.com/free-vector/driving-school-background_23-2149424638.jpg?ga=GA1.1.166634966.1750609643&semt=ais_hybrid&w=740',
        width: 740,
        height: 493,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMDS - Sri Senthil Murugan Driving School',
    description: 'The premier driving school in Thiyagadurgam, Kallakurichi.',
    images: ['https://img.freepik.com/free-vector/driving-school-background_23-2149424638.jpg?ga=GA1.1.166634966.1750609643&semt=ais_hybrid&w=740'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-body antialiased',
          fontBody.variable,
          fontHeadline.variable,
          fontCode.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
