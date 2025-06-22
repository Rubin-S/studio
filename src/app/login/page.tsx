'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@thiyagadrive.com' && password === 'password') {
      toast({
        title: "Login Successful",
        description: "Redirecting to admin dashboard...",
      });
      router.push('/admin');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@thiyagadrive.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
