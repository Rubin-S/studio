'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Car, LogOut, UserCircle } from 'lucide-react';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarContent } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      // This check only runs on the client-side
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (loggedIn) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace('/login');
      }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        router.push('/login');
    };

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/courses', label: 'Courses', icon: Car },
    ];

    // While checking authentication, show a loading skeleton to prevent content flash
    if (isAuthenticated === null) {
        return (
            <div className="flex h-screen w-full">
                {/* Sidebar Skeleton */}
                <div className="hidden w-64 flex-col border-r bg-card p-4 md:flex">
                    <div className="flex items-center gap-2 p-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-28" />
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col gap-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="mt-auto">
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                {/* Main Content Skeleton */}
                <div className="flex-1 space-y-8 p-8">
                    <div>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="mt-2 h-4 w-96" />
                    </div>
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-64 w-full rounded-lg" />
                </div>
            </div>
        );
    }
    
    // If not authenticated, the redirect is already in progress, so we return null
    if (!isAuthenticated) {
        return null;
    }

    return (
        <SidebarProvider>
            <Sidebar>
                <div className="flex h-full flex-col">
                    <SidebarHeader>
                        <div className="flex items-center gap-2 p-2">
                             <UserCircle className="h-10 w-10 text-primary" />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">Admin</span>
                                <span className="text-xs text-muted-foreground">Senthil Murugan</span>
                            </div>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <Link href={item.href} className="w-full">
                                        <SidebarMenuButton
                                            isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-2">
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </Button>
                    </SidebarFooter>
                </div>
            </Sidebar>
            <main className="flex-1 overflow-auto bg-secondary">
                <div className="p-4 sm:p-6 lg:p-8">{children}</div>
            </main>
        </SidebarProvider>
    );
}
