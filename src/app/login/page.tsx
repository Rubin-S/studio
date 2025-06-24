
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, loading, login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = searchParams.get('redirectTo') || '/';

  useEffect(() => {
    if (!loading && user) {
      if (user.email === 'admin@smds.com') {
        router.replace('/admin');
      } else {
        router.replace(redirectTo === '/' ? '/dashboard' : redirectTo);
      }
    }
  }, [user, loading, router, redirectTo]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      toast({
        title: "Login Successful",
        description: "Redirecting...",
      });
    } catch (err: any) {
      let description = "An unknown error occurred. Please try again.";
      
      if (err.code === 'auth/invalid-credential') {
        description = "Invalid email or password. Please double-check and try again.";
      } else if (err.message === 'Auth not initialized') {
        description = "Authentication service could not be reached. Please ensure Firebase is configured correctly.";
      } else if (err.code) {
        description = `An unexpected error occurred. Please try again later. (Code: ${err.code})`;
      }

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: description,
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
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
            <CardDescription>Login to access your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {redirectTo !== '/' && (
                <Alert>
                    <AlertTitle>Please Login</AlertTitle>
                    <AlertDescription>You need to be logged in to access this page.</AlertDescription>
                </Alert>
             )}
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
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href={`/signup?redirectTo=${encodeURIComponent(redirectTo)}`} className="font-medium text-primary hover:underline">
                    Sign up
                </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}


export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-secondary">
                <p>Loading...</p>
            </div>
        }>
            <LoginClient />
        </Suspense>
    )
}
