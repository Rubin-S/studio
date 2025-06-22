import Link from 'next/link';
import { Car, Twitter, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="font-headline text-xl font-bold">SMDS</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Your expert guide to safe driving in Thiyagadurgam.
            </p>
          </div>
          <div>
            <h3 className="font-headline font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground transition-colors hover:text-primary">Home</Link></li>
              <li><Link href="/courses" className="text-muted-foreground transition-colors hover:text-primary">Courses</Link></li>
              <li><Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground transition-colors hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="max-w-xs">123 Main Road, Thiyagadurgam, Kallakurichi, Tamil Nadu 606206</li>
              <li>+91 98765 43210</li>
              <li>contact@smds.com</li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary"><Twitter /></a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary"><Facebook /></a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary"><Instagram /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sri Senthil Murugan Driving School. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
