import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/fade-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping and Delivery Policy',
  description: 'Learn how services and communications are delivered by Sri Senthil Murugan Driving School.',
  robots: {
    index: false,
    follow: true,
  }
};

export default function ShippingPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary py-12 md:py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <Card className="max-w-4xl mx-auto shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary text-center">Shipping and Delivery Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>This policy outlines how we deliver our services. As we provide educational services and not physical goods, "shipping" and "delivery" refer to the confirmation and execution of our driving courses.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">1. Service Delivery</h2>
                <p>Our primary service is driving instruction, which is delivered in-person at the agreed-upon time and location. All necessary details regarding your class schedule will be communicated to you upon successful booking.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">2. Booking Confirmation</h2>
                <p>Upon successful booking and payment verification, you will receive a confirmation via email and/or SMS. This communication serves as proof of your booking and will contain details of your scheduled slot(s).</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">3. Electronic Documents</h2>
                <p>Any course materials, receipts, or other documentation will be delivered to you electronically via the email address provided during registration. Please ensure your contact details are accurate.</p>

                <h2 className="text-xl font-semibold text-foreground pt-4">4. No Physical Shipping</h2>
                <p>We do not ship any physical products. All transactions and service deliveries are managed digitally and in-person as described above.</p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
}
