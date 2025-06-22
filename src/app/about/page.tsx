import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { HardHat } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 text-center">
          <HardHat className="h-16 w-16 text-primary" />
          <h1 className="mt-8 font-headline text-4xl font-bold">About Us - Page Under Construction</h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            We are currently gathering all the information about our journey and our team. Please check back soon to learn more about Sri Senthil Murugan Driving School!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
