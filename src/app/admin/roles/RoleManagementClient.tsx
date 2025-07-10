
'use client';

import { useState } from 'react';
import type { AuthUser } from './actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isValid } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Shield, User } from 'lucide-react';
import { updateUserRole } from './actions';
import { useToast } from '@/hooks/use-toast';

interface RoleManagementClientProps {
  users: AuthUser[];
}

const formatDateSafe = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'PPp') : 'N/A';
};

export default function RoleManagementClient({ users: initialUsers }: RoleManagementClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const { toast } = useToast();

  const handleRoleChange = async (uid: string, newRole: 'admin' | 'student') => {
    const result = await updateUserRole(uid, newRole);

    if (result.success) {
      toast({
        title: 'Success',
        description: `User role has been updated to ${newRole}.`,
      });
      // Update local state to reflect the change immediately
      setUsers(currentUsers =>
        currentUsers.map(u => 
          u.uid === uid ? { ...u, customClaims: { role: newRole } } : u
        )
      );
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to update user role.',
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Display Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Last Signed In</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.uid}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>{user.displayName || 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={user.customClaims?.role === 'admin' ? 'default' : 'secondary'}>
                  {user.customClaims?.role === 'admin' ? (
                    <Shield className="mr-2 h-3 w-3" />
                  ) : (
                    <User className="mr-2 h-3 w-3" />
                  )}
                  {user.customClaims?.role || 'student'}
                </Badge>
              </TableCell>
              <TableCell>{formatDateSafe(user.creationTime)}</TableCell>
              <TableCell>{formatDateSafe(user.lastSignInTime)}</TableCell>
              <TableCell className="text-right">
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(user.uid, 'admin')}
                      disabled={user.customClaims?.role === 'admin'}
                    >
                      Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRoleChange(user.uid, 'student')}
                      disabled={user.customClaims?.role !== 'admin'}
                    >
                      Make Student
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center">No users found.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
