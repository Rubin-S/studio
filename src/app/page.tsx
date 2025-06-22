import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Car, BookOpenCheck } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedStats from '@/components/AnimatedStats';
import { FadeIn } from '@/components/ui/fade-in';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32">
          <div className="container mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
            <FadeIn delay="delay-100">
              <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
                Sri Senthil Murugan Driving School
              </h1>
            </FadeIn>
            <FadeIn delay="delay-300">
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Your trusted partner on the road to getting your license in Thiyagadurgam.
              </p>
            </FadeIn>
            <FadeIn delay="delay-500">
              <Button asChild size="lg" className="mt-8">
                <Link href="/courses">Book a Slot Now</Link>
              </Button>
            </FadeIn>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <FadeIn direction="left">
                <h2 className="font-headline text-3xl font-bold text-primary">
                  Welcome to Sri Senthil Murugan Driving School
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  As the premier driving school in Thiyagadurgam, we are dedicated to providing top-quality driving education. Our mission is to empower our students with the skills, knowledge, and confidence needed to become safe and responsible drivers for life. We value safety, professionalism, and student success above all else.
                </p>
                 <Button asChild variant="link" className="mt-4 px-0 text-lg">
                    <Link href="/about">Learn More About Us &rarr;</Link>
                 </Button>
              </FadeIn>
              <FadeIn direction="right">
                <div className="relative h-80 w-full rounded-lg shadow-xl md:h-96">
                  <Image
                    src="https://storage.googleapis.com/res_studio/smds-herosec/original.png"
                    alt="Sri Senthil Murugan Driving School"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                    data-ai-hint="driving school illustration"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        <section id="services" className="bg-secondary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <FadeIn>
              <h2 className="font-headline text-3xl font-bold">Our Core Services</h2>
              <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                We offer comprehensive training and assistance to ensure your success.
              </p>
            </FadeIn>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <FadeIn delay="delay-200">
                <Card className="text-left shadow-lg">
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
              </FadeIn>
              <FadeIn delay="delay-400">
                <Card className="text-left shadow-lg">
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
              </FadeIn>
            </div>
          </div>
        </section>

        <AnimatedStats />

        <section id="testimonials" className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <FadeIn>
              <h2 className="font-headline text-3xl font-bold">What Our Students Say</h2>
              <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                We are proud of our 5-star rating on Google. Check out what our students have to say!
              </p>
            </FadeIn>
            <FadeIn delay="delay-200">
              <Button asChild variant="outline" size="lg" className="mt-8">
                <a href="https://www.google.com/search?q=sri+senthil+murugan+driving+school+reviews" target="_blank" rel="noopener noreferrer">
                  <Star className="mr-2 h-5 w-5 fill-yellow-400 text-yellow-400" /> View All Google Reviews
                </a>
              </Button>
            </FadeIn>
          </div>
        </section>

        <section className="bg-secondary py-16 text-center md:py-24">
          <div className="container mx-auto px-4">
            <FadeIn>
              <h2 className="font-headline text-3xl font-bold">Ready to Start Your Driving Journey?</h2>
              <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                Join the hundreds of successful drivers who started with us. Book your first class today!
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link href="/courses">View Our Courses</Link>
              </Button>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
