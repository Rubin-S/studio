import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/fade-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Sri Senthil Murugan Driving School handles your personal information.',
  robots: {
    index: false,
    follow: true,
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary py-12 md:py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <Card className="max-w-4xl mx-auto shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary text-center">Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p><strong>Last Updated:</strong> 1 August 2024</p>
                <p>This is a template for a Privacy Policy. You should replace this content with your own policy details.</p>
                
                <h2 className="text-xl font-semibold text-foreground pt-4">1. Information We Collect</h2>
                <p>We collect information you provide directly to us when you book a course, such as your name, email address, phone number, and any other details required on our registration forms.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">2. How We Use Your Information</h2>
                <p>Your information is used to manage your bookings, communicate with you about your course schedule, process payments, and provide you with our services.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">3. Data Security</h2>
                <p>We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorized access. All data is stored securely using services provided by Google Firebase.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">4. Third-Party Services</h2>
                <p>We use third-party services like Google Firebase for database management, authentication, and storage. Their use of your information is governed by their own privacy policies.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">5. Changes to This Policy</h2>
                <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
}
