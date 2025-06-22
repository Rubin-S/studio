import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, Trophy } from 'lucide-react';
import Image from 'next/image';
import { FadeIn } from '@/components/ui/fade-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the history, values, and the dedicated team at Sri Senthil Murugan Driving School, Thiyagadurgam\'s most trusted driving school.',
  openGraph: {
      title: 'About Us | SMDS',
      description: 'Meet the team behind Thiyagadurgam\'s premier driving school.',
      images: [
          'https://firebasestorage.googleapis.com/v0/b/smds-2025-bbf18.firebasestorage.app/o/Images%2FIMG_20210801_153526.jpg?alt=media&token=8e327681-6bf0-441d-9af5-196373332472',
      ],
  }
};

const values = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    description: "We instill defensive driving techniques to ensure our students are safe and confident on the road."
  },
  {
    icon: Users,
    title: "Student-Centric",
    description: "Our patient instructors tailor lessons to individual learning styles, creating a supportive environment."
  },
  {
    icon: Trophy,
    title: "Excellence",
    description: "We are committed to the highest standards of driver education, aiming for first-time pass rates."
  }
];

const team = [
    { name: "Senthil Murugan", role: "Founder & Chief Instructor", image: "https://firebasestorage.googleapis.com/v0/b/smds-2025-bbf18.firebasestorage.app/o/Images%2FIMG_20210801_153526.jpg?alt=media&token=8e327681-6bf0-441d-9af5-196373332472", hint: "male instructor portrait" }
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-secondary py-20 text-center">
            <FadeIn>
                <h1 className="font-headline text-4xl font-bold text-primary">About Our Driving School</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Pioneering safe and confident drivers in Thiyagadurgam for over 25 years.
                </p>
            </FadeIn>
        </section>

        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="grid gap-12 md:grid-cols-2 md:items-center">
                    <FadeIn direction='left'>
                        <div className="relative h-80 w-full rounded-lg shadow-xl md:h-96">
                            <Image src="https://img.freepik.com/free-vector/driving-school-background_23-2149424638.jpg?ga=GA1.1.166634966.1750609643&semt=ais_hybrid&w=740" alt="Sri Senthil Murugan Driving School" layout="fill" objectFit="cover" className="rounded-lg" data-ai-hint="driving school illustration"/>
                        </div>
                    </FadeIn>
                    <FadeIn direction='right'>
                        <div>
                            <h2 className="font-headline text-3xl font-bold">Our Story</h2>
                            <p className="mt-4 text-muted-foreground">
                                Founded with a passion for road safety, Sri Senthil Murugan Driving School began as a small initiative to provide quality driving education to our local community. Over the years, we've grown into Thiyagadurgam's most trusted driving school, known for our professional instructors, modern fleet, and a curriculum that goes beyond just passing the test. We focus on creating responsible drivers for life.
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>

        <section className="bg-secondary py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
                <FadeIn>
                    <h2 className="font-headline text-3xl font-bold">Our Core Values</h2>
                    <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
                        The principles that guide our teaching and business.
                    </p>
                </FadeIn>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {values.map((value, index) => (
                        <FadeIn key={value.title} delay={`delay-${(index + 1) * 150}`}>
                            <Card className="text-center shadow-lg h-full">
                                <CardHeader className="items-center">
                                    <div className="rounded-full bg-primary/10 p-4 text-primary">
                                        <value.icon className="h-8 w-8" />
                                    </div>
                                    <CardTitle className="font-headline mt-4">{value.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{value.description}</p>
                                </CardContent>
                            </Card>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
        
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
                <FadeIn>
                    <h2 className="font-headline text-3xl font-bold">Meet Our Instructor</h2>
                    <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
                        The experienced professional dedicated to your success.
                    </p>
                </FadeIn>
                <div className="mt-12 flex justify-center">
                    <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
                        {team.map((member, index) => (
                             <FadeIn key={member.name} delay={`delay-${(index + 1) * 150}`}>
                                <Card className="overflow-hidden text-center shadow-lg">
                                    <div className="relative h-64 w-full">
                                       <Image src={member.image} alt={member.name} layout="fill" objectFit="cover" data-ai-hint={member.hint}/>
                                    </div>
                                    <CardContent className="p-6">
                                        <h3 className="font-headline text-xl font-bold">{member.name}</h3>
                                        <p className="text-primary">{member.role}</p>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
