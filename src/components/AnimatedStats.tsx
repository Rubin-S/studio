"use client";

import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Users, Award, CalendarDays } from 'lucide-react';

const stats = [
  { icon: CalendarDays, value: 15, label: "Years of Experience" },
  { icon: Users, value: 1200, label: "Happy Customers Trained" },
  { icon: Award, value: 1000, label: "Licenses Acquired" },
];

function AnimatedCounter({ endValue }: { endValue: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const duration = 1500;
    
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
  
  return <span className="font-headline text-5xl font-bold text-primary">{count}+</span>;
}

export default function AnimatedStats() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section id="stats" ref={ref} className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-4 text-primary">
                 <stat.icon className="h-10 w-10" />
              </div>
              <div className="mt-4">
                {inView ? <AnimatedCounter endValue={stat.value} /> : <span className="font-headline text-5xl font-bold text-primary">0+</span>}
              </div>
              <p className="mt-2 text-lg text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
