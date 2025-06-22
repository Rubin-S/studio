import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Users, BarChart, PlusCircle } from "lucide-react";
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin! Here's an overview of your site.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Currently active course</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Website Visits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Page Views</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1,200</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
            <CardDescription>Manage your website content from one place.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/admin/courses/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Course
              </Link>
            </Button>
             <Button asChild variant="outline">
              <Link href="/admin/courses">
                <Car className="mr-2 h-4 w-4" /> Manage Courses
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
       <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Analytics Integration</CardTitle>
            <CardDescription>For more detailed analytics, connect your Google Analytics account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-8 text-center">
              <div>
                <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Google Analytics embed would be displayed here.</p>
                <Button variant="secondary" className="mt-4">Connect Google Analytics</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
