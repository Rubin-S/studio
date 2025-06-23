import { getStudents } from '@/lib/students';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

const formatDateSafe = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'PPP') : 'N/A';
};

export default async function AdminStudentsPage() {
  const students = await getStudents();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold font-headline">Student Management</h1>
          <p className="text-muted-foreground">View all registered student accounts.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
          <CardDescription>
            {students.length} student(s) found.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Display Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Joined On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.uid}>
                    <TableCell className="font-medium">{student.displayName}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{formatDateSafe(student.createdAt)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No students found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
