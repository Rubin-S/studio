import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Car, BookOpenCheck, Users, Award } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedStats from '@/components/AnimatedStats';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative h-[60vh] w-full bg-gradient-to-r from-primary/80 to-primary">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Driving school car on an open road"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
            data-ai-hint="driving road"
          />
          <div className="container mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-primary-foreground">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Learn to Drive with Confidence
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">
              Sri Senthil Murugan Driving School: Your trusted partner on the road to getting your license in Thiyagadurgam.
            </p>
            <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/courses">Book a Slot Now</Link>
            </Button>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="font-headline text-3xl font-bold text-primary">
                  Welcome to Sri Senthil Murugan Driving School
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  As the premier driving school in Thiyagadurgam, we are dedicated to providing top-quality driving education. Our mission is to empower our students with the skills, knowledge, and confidence needed to become safe and responsible drivers for life. We value safety, professionalism, and student success above all else.
                </p>
              </div>
              <div className="relative h-64 w-full rounded-lg shadow-xl md:h-80">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="Instructor with a student in a car"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  data-ai-hint="driving instructor"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="bg-secondary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl font-bold">Our Services</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              We offer comprehensive training and assistance to ensure your success.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <Card className="text-left">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <Car className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline text-2xl">Car Training</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our hands-on car training program is designed to cover everything from basic controls to advanced driving maneuvers in various traffic conditions.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <BookOpenCheck className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline text-2xl">License Assistance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We guide you through the entire RTO process, from filling out forms to preparing for the test, making it a hassle-free experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <AnimatedStats />

        <section id="testimonials" className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl font-bold">What Our Students Say</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              We are proud of our 5-star rating on Google. Here's what our happy customers have to say.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Priya K.", review: "Excellent teaching! I got my license on the first try. The instructor was very patient and professional." },
                { name: "Arun S.", review: "The best driving school in the area. They provide clear instructions and build your confidence." },
                { name: "Sunita M.", review: "Highly recommended! Their license assistance service saved me a lot of time and effort." },
              ].map((testimonial, index) => (
                <Card key={index} className="text-left">
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="mt-4 text-muted-foreground">"{testimonial.review}"</p>
                    <p className="mt-4 font-bold">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
             <Button asChild variant="outline" size="lg" className="mt-12">
                <a href="#" target="_blank" rel="noopener noreferrer">View All Google Reviews</a>
             </Button>
          </div>
        </section>

        <section className="bg-primary py-16 text-primary-foreground md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl font-bold">Ready to Start Your Driving Journey?</h2>
            <p className="mx-auto mt-2 max-w-2xl opacity-80">
              Join the hundreds of successful drivers who started with us. Book your first class today!
            </p>
            <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/courses">View Our Courses</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
