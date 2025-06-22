import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <FadeIn>
              <h1 className="font-headline text-4xl font-bold text-primary">Get in Touch</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                We're here to help you on your driving journey. Contact us with any questions.
              </p>
            </FadeIn>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <FadeIn delay="delay-200">
              <Card className="h-full shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-full bg-primary/10 p-3 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Our Address</h3>
                      <p className="text-muted-foreground">123 Main Road, Thiyagadurgam, Kallakurichi, Tamil Nadu 606206</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-full bg-primary/10 p-3 text-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone Number</h3>
                      <a href="tel:+919876543210" className="text-muted-foreground transition-colors hover:text-primary">+91 98765 43210</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-full bg-primary/10 p-3 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email Address</h3>
                      <a href="mailto:contact@smds.com" className="text-muted-foreground transition-colors hover:text-primary">contact@smds.com</a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
            <FadeIn delay="delay-400">
              <Card className="shadow-lg">
                 <CardHeader>
                  <CardTitle className="font-headline">Our Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                     <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.990422981966!2d79.09559191526369!3d11.693892591784999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbaf07555555555%3A0x6e2f755555555555!2sThiyagadurgam!5e0!3m2!1sen!2sin!4v1622558888888!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        title="Google Maps Location of Thiyagadurgam"
                      ></iframe>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
          
          <FadeIn>
            <Card className="mt-8 shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-center">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                   <iframe
                      src="https://docs.google.com/forms/d/e/1FAIpQLSdw7QzaP2hG4F7w2Yd_cR7D0iA_bKvJ8aP9xW8eL9T0uR3c_A/viewform?embedded=true"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      marginHeight={0}
                      marginWidth={0}
                      title="Contact Form"
                    >
                      Loading…
                    </iframe>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

        </div>
      </main>
      <Footer />
    </div>
  );
}
