'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { Course } from '@/lib/types';
import { createCourseAction, updateCourseAction } from './actions';
import { PlusCircle, Trash2 } from 'lucide-react';

const formSchema = z.object({
  title: z.object({
    en: z.string().min(1, 'English title is required'),
    ta: z.string().min(1, 'Tamil title is required'),
  }),
  thumbnail: z.string().url('Must be a valid URL'),
  shortDescription: z.object({
    en: z.string().min(1, 'English short description is required'),
    ta: z.string().min(1, 'Tamil short description is required'),
  }),
  detailedDescription: z.object({
    en: z.string().min(1, 'English detailed description is required'),
    ta: z.string().min(1, 'Tamil detailed description is required'),
  }),
  whatWeOffer: z.array(z.object({
    en: z.string().min(1, 'English feature is required'),
    ta: z.string().min(1, 'Tamil feature is required'),
  })),
  price: z.object({
    original: z.coerce.number().min(0),
    discounted: z.coerce.number().min(0),
  }),
  instructions: z.object({
    en: z.string().min(1, 'English instructions are required'),
    ta: z.string().min(1, 'Tamil instructions are required'),
  }),
  youtubeLink: z.string().url().optional().or(z.literal('')),
  googleCalendarLink: z.string().url().optional().or(z.literal('')),
  googleFormLink: z.string().url().optional().or(z.literal('')),
});

type CourseFormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
  course?: Course;
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!course;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing ? course : {
        title: { en: '', ta: '' },
        thumbnail: 'https://placehold.co/600x400.png',
        shortDescription: { en: '', ta: '' },
        detailedDescription: { en: '', ta: '' },
        whatWeOffer: [{ en: '', ta: '' }],
        price: { original: 0, discounted: 0 },
        instructions: { en: '', ta: '' },
        youtubeLink: '',
        googleCalendarLink: '',
        googleFormLink: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "whatWeOffer",
  });

  const onSubmit = async (data: CourseFormValues) => {
    try {
      if (isEditing) {
        await updateCourseAction(course.id, data);
        toast({ title: 'Success', description: 'Course updated successfully.' });
      } else {
        await createCourseAction(data);
        toast({ title: 'Success', description: 'Course created successfully.' });
      }
      router.push('/admin/courses');
      router.refresh();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong.' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="english" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="english">English Content</TabsTrigger>
            <TabsTrigger value="tamil">Tamil Content</TabsTrigger>
          </TabsList>
          <TabsContent value="english" className="space-y-6 pt-6">
            <FormField name="title.en" render={({ field }) => <FormItem><FormLabel>Title (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField name="shortDescription.en" render={({ field }) => <FormItem><FormLabel>Short Desc. (EN)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField name="detailedDescription.en" render={({ field }) => <FormItem><FormLabel>Detailed Desc. (EN)</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField name="instructions.en" render={({ field }) => <FormItem><FormLabel>Instructions (EN)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
          </TabsContent>
          <TabsContent value="tamil" className="space-y-6 pt-6">
            <FormField name="title.ta" render={({ field }) => <FormItem><FormLabel>Title (TA)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField name="shortDescription.ta" render={({ field }) => <FormItem><FormLabel>Short Desc. (TA)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField name="detailedDescription.ta" render={({ field }) => <FormItem><FormLabel>Detailed Desc. (TA)</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField name="instructions.ta" render={({ field }) => <FormItem><FormLabel>Instructions (TA)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader><CardTitle>What We Offer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-end">
                <FormField name={`whatWeOffer.${index}.en`} render={({ field }) => <FormItem className="flex-1"><FormLabel>Feature (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField name={`whatWeOffer.${index}.ta`} render={({ field }) => <FormItem className="flex-1"><FormLabel>Feature (TA)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ en: '', ta: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Feature</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pricing & Links</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField name="price.original" render={({ field }) => <FormItem><FormLabel>Original Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
             <FormField name="price.discounted" render={({ field }) => <FormItem><FormLabel>Discounted Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
             <FormField name="thumbnail" render={({ field }) => <FormItem className="md:col-span-2"><FormLabel>Thumbnail URL</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>URL for the course image.</FormDescription><FormMessage /></FormItem>} />
             <FormField name="youtubeLink" render={({ field }) => <FormItem><FormLabel>YouTube Embed Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
             <FormField name="googleCalendarLink" render={({ field }) => <FormItem><FormLabel>Google Calendar Embed Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
             <FormField name="googleFormLink" render={({ field }) => <FormItem><FormLabel>Google Form Embed Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
          </CardContent>
        </Card>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
        </Button>
      </form>
    </Form>
  );
}
