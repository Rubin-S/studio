'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Car, LogOut, UserCircle } from 'lucide-react';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarContent } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
      if (localStorage.getItem('isLoggedIn') !== 'true') {
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

    if (!isClient) {
        return null; // or a loading spinner
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
