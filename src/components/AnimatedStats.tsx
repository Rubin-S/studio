"use client";

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Users, CalendarDays } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

function AnimatedCounter({ endValue }: { endValue: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const duration = 2000;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(percentage * endValue));
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [endValue]);
  
  return <>{count.toLocaleString()}</>;
}

export default function AnimatedStats() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section id="stats" ref={ref} className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-2 lg:w-2/3 mx-auto">
          <FadeIn delay="delay-150">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-4 text-primary">
                 <CalendarDays className="h-10 w-10" />
              </div>
              <div className="mt-4 font-headline text-5xl font-bold text-primary">
                {inView ? <AnimatedCounter endValue={15} /> : '0'}+
              </div>
              <p className="mt-2 text-lg text-muted-foreground">Years of Experience</p>
            </div>
          </FadeIn>
          <FadeIn delay="delay-300">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-4 text-primary">
                 <Users className="h-10 w-10" />
              </div>
              <div className="mt-4 font-headline text-5xl font-bold text-primary">
                {inView ? <AnimatedCounter endValue={5} /> : '0'}k+
              </div>
              <p className="mt-2 text-lg text-muted-foreground">Happy Customers</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
