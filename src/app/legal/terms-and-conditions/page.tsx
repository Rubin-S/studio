import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/fade-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Read the terms and conditions for using the Sri Senthil Murugan Driving School website and services.',
  robots: {
    index: false,
    follow: true,
  }
};

export default function TermsAndConditionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary py-12 md:py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <Card className="max-w-4xl mx-auto shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary text-center">Terms and Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                 <p><strong>Last Updated:</strong> August 1, 2024</p>
                <p>Please read these terms and conditions carefully before using our service. This is a template and should be updated with your specific terms.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">1. Agreement to Terms</h2>
                <p>By accessing our website and using our services, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">2. User Responsibilities</h2>
                <p>You are responsible for providing accurate and complete information during the booking process. You must possess a valid Learner's License where required by law and our course policies.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">3. Bookings and Payments</h2>
                <p>All bookings are subject to availability. Payment must be completed as per the instructions on the booking page to confirm your slot. We reserve the right to cancel bookings that do not adhere to our payment policies.</p>
                
                <h2 className="text-xl font-semibold text-foreground pt-4">4. Limitation of Liability</h2>
                <p>Sri Senthil Murugan Driving School is not liable for any incidents that occur outside of the official training sessions. We are committed to providing a safe learning environment during our classes.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">5. Governing Law</h2>
                <p>These terms shall be governed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
}
