'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { FirebaseError } from 'firebase/app';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, loading, signup } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: "Passwords do not match.",
      });
      return;
    }
    setIsSubmitting(true);
    
    try {
      await signup(email, password);
      toast({
        title: "Signup Successful",
        description: "Welcome! Redirecting you now...",
      });
    } catch (err: any) {
      let description = "An unknown error occurred. Please try again.";
      
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            description = "This email is already registered. Please try logging in.";
            break;
          case 'auth/weak-password':
            description = "The password is too weak. Please choose a stronger password.";
            break;
          case 'auth/invalid-email':
            description = "The email address is not valid.";
            break;
        }
      }

      toast({
        variant: "destructive",
        title: "Signup Failed",
        description,
      });
      setIsSubmitting(false);
    }
  };
  
  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSignup}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
            <CardDescription>Start your driving journey with us today.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`} className="font-medium text-primary hover:underline">
                    Log in
                </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
