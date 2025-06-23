import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/fade-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation and Refund Policy',
  description: 'Understand the cancellation and refund policy for courses at Sri Senthil Murugan Driving School.',
  robots: {
    index: false,
    follow: true,
  }
};

export default function CancellationPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary py-12 md:py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <Card className="max-w-4xl mx-auto shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary text-center">Cancellation and Refund Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>This is a template policy and should be updated to reflect your specific business practices.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">1. Cancellation by Customer</h2>
                <p>To cancel a booked slot, please contact us directly via phone or email at least [e.g., 48 hours] before the scheduled time. Cancellations made after this period may not be eligible for a refund or rescheduling.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">2. Refund Eligibility</h2>
                <p>Refunds are processed on a case-by-case basis. Eligibility for a refund depends on the timing of the cancellation and the specific course terms. Full refunds are generally provided if the cancellation is made within the specified notice period.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">3. How to Request a Refund</h2>
                <p>To request a refund, please contact our support team with your booking details and reason for cancellation. Refunds will be processed to the original method of payment within [e.g., 7-10 business days].</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">4. Cancellation by Us</h2>
                <p>In the unlikely event that we need to cancel a scheduled class due to unforeseen circumstances, we will notify you as soon as possible and offer a full refund or an option to reschedule.</p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
}
