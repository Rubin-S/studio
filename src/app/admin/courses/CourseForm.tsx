'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, type Control } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { Course } from '@/lib/types';
import { createCourseAction, updateCourseAction } from './actions';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const localizedStringSchema = z.object({
  en: z.string().min(1, 'English value is required'),
  ta: z.string().min(1, 'Tamil value is required'),
});

const formFieldSchema = z.object({
  id: z.string().default(() => uuidv4()),
  type: z.enum(['text', 'email', 'tel', 'textarea', 'select']).default('text'),
  label: localizedStringSchema,
  placeholder: localizedStringSchema.optional(),
  required: z.boolean().default(false),
  options: z.array(localizedStringSchema).optional(),
});

const courseSlotSchema = z.object({
  id: z.string().default(() => uuidv4()),
  dateTime: z.string().min(1, 'Date and time is required'),
  bookedBy: z.object({
    name: z.string(),
    bookingId: z.string(),
  }).nullable().default(null),
});


const courseFormSchema = z.object({
  title: localizedStringSchema,
  thumbnail: z.string().url('Must be a valid URL'),
  shortDescription: localizedStringSchema,
  detailedDescription: localizedStringSchema,
  whatWeOffer: z.array(localizedStringSchema),
  price: z.object({
    original: z.coerce.number().min(0),
    discounted: z.coerce.number().min(0),
  }),
  instructions: localizedStringSchema,
  youtubeLink: z.string().url().optional().or(z.literal('')),
  documentUrl: z.string().url().optional().or(z.literal('')),
  formFields: z.array(formFieldSchema),
  slots: z.array(courseSlotSchema),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

// Helper component for editing select options, defined outside the main component
function FormFieldOptionsEditor({ control, fieldIndex }: { control: Control<CourseFormValues>; fieldIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `formFields.${fieldIndex}.options`,
  });

  return (
    <div className="mt-4 space-y-4 rounded-md border bg-muted/50 p-4">
      <h4 className="font-medium text-sm text-muted-foreground">Options for Select Field</h4>
      <div className="space-y-4">
        {fields.map((field, optionIndex) => (
          <div key={field.id} className="flex gap-2 items-end">
            <FormField
              name={`formFields.${fieldIndex}.options.${optionIndex}.en`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs">Option (EN)</FormLabel>
                  <FormControl><Input {...field} placeholder="Option in English" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`formFields.${fieldIndex}.options.${optionIndex}.ta`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs">Option (TA)</FormLabel>
                  <FormControl><Input {...field} placeholder="Option in Tamil" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(optionIndex)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => append({ en: '', ta: '' })}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Option
      </Button>
    </div>
  );
}

interface CourseFormProps {
  course?: Course;
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!course;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: isEditing ? course : {
        title: { en: '', ta: '' },
        thumbnail: 'https://placehold.co/600x400.png',
        shortDescription: { en: '', ta: '' },
        detailedDescription: { en: '', ta: '' },
        whatWeOffer: [{ en: '', ta: '' }],
        price: { original: 0, discounted: 0 },
        instructions: { en: '', ta: '' },
        youtubeLink: '',
        documentUrl: '',
        formFields: [],
        slots: [],
    },
  });

  const { fields: offerFields, append: appendOffer, remove: removeOffer } = useFieldArray({ control: form.control, name: "whatWeOffer" });
  const { fields: formFields, append: appendFormField, remove: removeFormField } = useFieldArray({ control: form.control, name: "formFields" });
  const { fields: slotFields, append: appendSlot, remove: removeSlot } = useFieldArray({ control: form.control, name: "slots" });

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
            {offerFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-end">
                <FormField name={`whatWeOffer.${index}.en`} render={({ field }) => <FormItem className="flex-1"><FormLabel>Feature (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField name={`whatWeOffer.${index}.ta`} render={({ field }) => <FormItem className="flex-1"><FormLabel>Feature (TA)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <Button type="button" variant="destructive" size="icon" onClick={() => removeOffer(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendOffer({ en: '', ta: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Feature</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pricing & Media</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField name="price.original" render={({ field }) => <FormItem><FormLabel>Original Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
             <FormField name="price.discounted" render={({ field }) => <FormItem><FormLabel>Discounted Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
             <FormField name="thumbnail" render={({ field }) => <FormItem className="md:col-span-2"><FormLabel>Thumbnail URL</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>URL for the course image.</FormDescription><FormMessage /></FormItem>} />
             <FormField name="youtubeLink" render={({ field }) => <FormItem><FormLabel>YouTube Embed Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
             <FormField name="documentUrl" render={({ field }) => <FormItem><FormLabel>Document URL (PDF/DOCX)</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>Link to course materials (e.g., syllabus).</FormDescription><FormMessage /></FormItem>} />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Custom Registration Form</CardTitle>
                <CardDescription>Build a form for users to fill out when booking. Add any fields you need to collect information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {formFields.map((field, index) => {
                  const fieldType = form.watch(`formFields.${index}.type`);

                  return (
                    <div key={field.id} className="rounded-lg border p-4 space-y-4 relative bg-card">
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={() => removeFormField(index)}><Trash2 className="h-4 w-4" /></Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name={`formFields.${index}.type`} render={({ field }) => <FormItem><FormLabel>Field Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="text">Text</SelectItem><SelectItem value="email">Email</SelectItem><SelectItem value="tel">Phone Number</SelectItem><SelectItem value="textarea">Text Area</SelectItem><SelectItem value="select">Select</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
                            <FormField name={`formFields.${index}.required`} render={({ field }) => <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 h-10"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Required</FormLabel></div></FormItem>} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField name={`formFields.${index}.label.en`} render={({ field }) => <FormItem><FormLabel>Label (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                            <FormField name={`formFields.${index}.label.ta`} render={({ field }) => <FormItem><FormLabel>Label (TA)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        </div>
                        
                        {fieldType !== 'select' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField name={`formFields.${index}.placeholder.en`} render={({ field }) => <FormItem><FormLabel>Placeholder (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField name={`formFields.${index}.placeholder.ta`} render={({ field }) => <FormItem><FormLabel>Placeholder (TA)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                            </div>
                        )}

                        {fieldType === 'select' && (
                            <FormFieldOptionsEditor
                                control={form.control}
                                fieldIndex={index}
                            />
                        )}
                    </div>
                  );
                })}
                <Button type="button" variant="outline" size="sm" onClick={() => appendFormField({id: uuidv4(), type: 'text', label: { en: '', ta: '' }, placeholder: { en: '', ta: '' }, required: false, options: [] })}><PlusCircle className="mr-2 h-4 w-4" /> Add Form Field</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
                <CardDescription>Add the specific dates and times available for booking this course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {slotFields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end">
                        <FormField name={`slots.${index}.dateTime`} render={({ field }) => <FormItem className="flex-1"><FormLabel>Slot Date & Time</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>} />
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeSlot(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendSlot({id: uuidv4(), dateTime: '', bookedBy: null })}><PlusCircle className="mr-2 h-4 w-4" /> Add Slot</Button>
            </CardContent>
        </Card>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
        </Button>
      </form>
    </Form>
  );
}
