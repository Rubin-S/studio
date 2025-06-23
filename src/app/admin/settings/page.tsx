'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteAllDataAction, seedSampleDataAction } from './actions';
import { useState } from 'react';
import { Settings, Trash2, DatabaseZap } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAllDataAction();
      toast({
        title: 'Success',
        description: 'All courses and bookings have been deleted.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete data.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedSampleDataAction();
      toast({
        title: 'Success',
        description:
          'Database has been wiped and seeded with sample course data.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to seed data.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold font-headline">Site Settings</h1>
          <p className="text-muted-foreground">
            Manage your website's data and configuration.
          </p>
        </div>
      </div>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            These actions are irreversible. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                <Trash2 className="mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete All Site Data'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all
                  courses and bookings from your database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Yes, delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant="outline"
            onClick={handleSeed}
            disabled={isSeeding}
          >
            <DatabaseZap className="mr-2" />
            {isSeeding ? 'Seeding...' : 'Seed Sample Data'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
