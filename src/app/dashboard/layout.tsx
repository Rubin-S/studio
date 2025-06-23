'use client';

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login?redirectTo=/dashboard');
        }
    }, [user, loading, router]);
    
    if (loading || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-secondary">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
