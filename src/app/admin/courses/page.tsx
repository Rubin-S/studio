import { getCourses } from '@/lib/courses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import CourseActions from './CourseActions';

export default async function AdminCoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Course Management</h1>
          <p className="text-muted-foreground">Add, edit, or delete driving courses.</p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Course
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Courses</CardTitle>
          <CardDescription>A list of all courses currently on your website.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title (English)</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title.en}</TableCell>
                    <TableCell>₹{course.price.discounted.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right">
                      <CourseActions courseId={course.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No courses found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
