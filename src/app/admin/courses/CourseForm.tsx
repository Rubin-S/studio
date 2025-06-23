'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, type Control, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useState, useMemo } from 'react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { Course, RegistrationForm } from '@/lib/types';
import { createCourseAction, updateCourseAction } from './actions';
import { PlusCircle, Trash2, Copy, Check, ArrowDown, ArrowUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

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

const navigationRuleSchema = z.object({
  fieldId: z.string().min(1),
  value: z.string().min(1),
  nextStepId: z.string().min(1),
});

const formStepSchema = z.object({
  id: z.string().default(() => uuidv4()),
  name: localizedStringSchema,
  fields: z.array(formFieldSchema),
  navigationRules: z.array(navigationRuleSchema).optional(),
});

const registrationFormSchema = z.object({
  steps: z.array(formStepSchema),
});

const courseSlotSchema = z.object({
  id: z.string().default(() => uuidv4()),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  bookedBy: z.object({ name: z.string(), bookingId: z.string() }).nullable().default(null),
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
  registrationForm: registrationFormSchema,
  slots: z.array(courseSlotSchema),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

// Navigation Rules UI
function NavigationRulesEditor({ control, stepIndex, allSteps }: { control: Control<CourseFormValues>, stepIndex: number, allSteps: CourseFormValues['registrationForm']['steps'] }) {
  const { fields, append, remove } = useFieldArray({ control, name: `registrationForm.steps.${stepIndex}.navigationRules` });
  const currentStep = useFormContext<CourseFormValues>().watch(`registrationForm.steps.${stepIndex}`);
  const selectableFields = currentStep.fields.filter(f => f.type === 'select');

  return (
    <div className="mt-4 space-y-4 rounded-md border bg-muted/50 p-4">
      <h4 className="font-medium text-sm text-muted-foreground">Conditional Navigation Rules</h4>
      {fields.map((rule, ruleIndex) => (
        <div key={rule.id} className="flex flex-col md:flex-row gap-2 items-end p-2 border rounded-md">
          <FormField
            name={`registrationForm.steps.${stepIndex}.navigationRules.${ruleIndex}.fieldId`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-xs">If field</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a field..." /></SelectTrigger></FormControl>
                  <SelectContent>{selectableFields.map(f => <SelectItem key={f.id} value={f.id}>{f.label.en}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={`registrationForm.steps.${stepIndex}.navigationRules.${ruleIndex}.value`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-xs">has value</FormLabel>
                <FormControl><Input {...field} placeholder="Enter option value (EN)" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={`registrationForm.steps.${stepIndex}.navigationRules.${ruleIndex}.nextStepId`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-xs">then go to step</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a step..." /></SelectTrigger></FormControl>
                  <SelectContent>{allSteps.filter((_, i) => i !== stepIndex).map(s => <SelectItem key={s.id} value={s.id}>{s.name.en}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(ruleIndex)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ fieldId: '', value: '', nextStepId: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Rule</Button>
    </div>
  );
}


// Form Fields UI within a step
function StepFieldsEditor({ control, stepIndex }: { control: Control<CourseFormValues>; stepIndex: number }) {
  const { fields, append, remove, move } = useFieldArray({ control, name: `registrationForm.steps.${stepIndex}.fields` });

  return (
    <div className="space-y-4 pt-4">
      {fields.map((field, fieldIndex) => {
        const fieldType = useFormContext<CourseFormValues>().watch(`registrationForm.steps.${stepIndex}.fields.${fieldIndex}.type`);
        return (
          <div key={field.id} className="rounded-lg border p-4 space-y-4 relative bg-card/50">
            <div className="absolute top-2 right-2 z-10 flex gap-1">
                <Button type="button" variant="ghost" size="icon" disabled={fieldIndex === 0} onClick={() => move(fieldIndex, fieldIndex - 1)}><ArrowUp className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="icon" disabled={fieldIndex === fields.length - 1} onClick={() => move(fieldIndex, fieldIndex + 1)}><ArrowDown className="h-4 w-4" /></Button>
                <Button type="button" variant="destructive" size="icon" onClick={() => remove(fieldIndex)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name={`registrationForm.steps.${stepIndex}.fields.${fieldIndex}.type`} render={({ field }) => <FormItem><FormLabel>Field Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="text">Text</SelectItem><SelectItem value="email">Email</SelectItem><SelectItem value="tel">Phone Number</SelectItem><SelectItem value="textarea">Text Area</SelectItem><SelectItem value="select">Select</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
              <FormField name={`registrationForm.steps.${stepIndex}.fields.${fieldIndex}.required`} render={({ field }) => <FormItem className="flex flex-row items-center justify-center space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Required</FormLabel></div></FormItem>} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name={`registrationForm.steps.${stepIndex}.fields.${fieldIndex}.label.en`} render={({ field }) => <FormItem><FormLabel>Label (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField name={`registrationForm.steps.${stepIndex}.fields.${fieldIndex}.label.ta`} render={({ field }) => <FormItem><FormLabel>Label (TA)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            </div>
            {fieldType !== 'select' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name={`registrationForm.steps.${stepIndex}.fields.${fieldIndex}.placeholder.en`} render={({ field }) => <FormItem><FormLabel>Placeholder (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField name={`registrationForm.steps.${stepIndex}.fields.${fieldIndex}.placeholder.ta`} render={({ field }) => <FormItem><FormLabel>Placeholder (TA)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            </div>)}
            {fieldType === 'select' && <FormFieldOptionsEditor control={control} fieldNamePrefix={`registrationForm.steps.${stepIndex}.fields.${fieldIndex}.options`} />}
          </div>
        );
      })}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: uuidv4(), type: 'text', label: { en: '', ta: '' }, placeholder: { en: '', ta: '' }, required: false, options: [] })}><PlusCircle className="mr-2 h-4 w-4" /> Add Form Field</Button>
    </div>
  );
}

// Select options UI
function FormFieldOptionsEditor({ control, fieldNamePrefix }: { control: Control<CourseFormValues>; fieldNamePrefix: string }) {
  const { fields, append, remove } = useFieldArray({ control, name: fieldNamePrefix as any });
  return (
    <div className="mt-4 space-y-4 rounded-md border bg-muted/50 p-4">
      <h4 className="font-medium text-sm text-muted-foreground">Options for Select Field</h4>
      <div className="space-y-4">
        {fields.map((field, optionIndex) => (
          <div key={field.id} className="flex gap-2 items-end">
            <FormField name={`${fieldNamePrefix}.${optionIndex}.en`} render={({ field }) => <FormItem className="flex-1"><FormLabel className="text-xs">Option (EN)</FormLabel><FormControl><Input {...field} placeholder="Option in English" /></FormControl><FormMessage /></FormItem>} />
            <FormField name={`${fieldNamePrefix}.${optionIndex}.ta`} render={({ field }) => <FormItem className="flex-1"><FormLabel className="text-xs">Option (TA)</FormLabel><FormControl><Input {...field} placeholder="Option in Tamil" /></FormControl><FormMessage /></FormItem>} />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(optionIndex)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => append({ en: '', ta: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Option</Button>
    </div>
  );
}


function CopySlotsDialog({ slots, onCopy }: { slots: CourseFormValues['slots'], onCopy: (sourceDate: string, targetDates: Date[]) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceDate, setSourceDate] = useState<string>('');
  const [targetDates, setTargetDates] = useState<Date[]>([]);

  const uniqueDates = useMemo(() => {
    const dates = new Set<string>();
    slots.forEach(slot => {
        if (slot.date && typeof slot.date === 'string') {
            const parsedDate = parseISO(slot.date);
            if (!isNaN(parsedDate.getTime())) {
                dates.add(slot.date);
            }
        }
    });
    return Array.from(dates).sort();
  }, [slots]);

  const handleCopy = () => {
    if (sourceDate && targetDates.length > 0) {
      onCopy(sourceDate, targetDates);
      setIsOpen(false);
      setSourceDate('');
      setTargetDates([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm"><Copy className="mr-2 h-4 w-4" /> Copy Slots</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Copy Slots to Other Dates</DialogTitle><DialogDescription>Select a source date and then choose one or more target dates to copy the time slots to.</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <Select onValueChange={setSourceDate} value={sourceDate}>
            <SelectTrigger><SelectValue placeholder="Select a source date to copy from..." /></SelectTrigger>
            <SelectContent>
              {uniqueDates.map(date => {
                const parsedDate = parseISO(date);
                if (isNaN(parsedDate.getTime())) return null;
                return <SelectItem key={date} value={date}>{format(parsedDate, 'PPP')}</SelectItem>;
              })}
            </SelectContent>
          </Select>
          <div>
            <Label>Select target dates to paste to</Label>
            <Calendar mode="multiple" min={1} selected={targetDates} onSelect={(dates) => setTargetDates(dates || [])} className="rounded-md border mt-2" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleCopy} disabled={!sourceDate || targetDates.length === 0}>Copy Slots</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


interface CourseFormProps {
  course?: Course;
}

const steps = [
    { id: 1, name: 'Course Info', fields: ['title.en', 'title.ta', 'shortDescription.en', 'shortDescription.ta', 'detailedDescription.en', 'detailedDescription.ta', 'instructions.en', 'instructions.ta', 'whatWeOffer'] },
    { id: 2, name: 'Registration Form', fields: ['registrationForm'] },
    { id: 3, name: 'Time Slots', fields: ['slots'] },
    { id: 4, name: 'Pricing & Media', fields: ['price.original', 'price.discounted', 'thumbnail', 'youtubeLink', 'documentUrl'] },
  ];

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!course;
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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
        registrationForm: { steps: [{ id: uuidv4(), name: { en: 'Step 1', ta: 'படி 1' }, fields: [] }] },
        slots: [],
    },
  });

  const { fields: offerFields, append: appendOffer, remove: removeOffer } = useFieldArray({ control: form.control, name: "whatWeOffer" });
  const { fields: registrationSteps, append: appendStep, remove: removeStep, move: moveStep } = useFieldArray({ control: form.control, name: "registrationForm.steps" });
  const { fields: slotFields, append: appendSlot, remove: removeSlot } = useFieldArray({ control: form.control, name: "slots" });
  
  const allSlots = form.watch('slots');
  const allSteps = form.watch('registrationForm.steps');

  const datesWithSlots = useMemo(() => {
    const validDates = new Set<string>();
    allSlots.forEach(slot => {
        if (slot.date && typeof slot.date === 'string' && !isNaN(parseISO(slot.date).getTime())) {
            validDates.add(slot.date);
        }
    });
    return Array.from(validDates).map(dateStr => parseISO(dateStr));
  }, [allSlots]);

  const formattedSelectedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  const handleAddSlot = () => {
    if (selectedDate) {
      appendSlot({
        id: uuidv4(),
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: '',
        endTime: '',
        bookedBy: null,
      });
    } else {
      toast({
        title: "No Date Selected",
        description: "Please select a date from the calendar to add slots.",
        variant: "destructive",
      });
    }
  };

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
  
  const handleNext = async () => {
    const fields = steps[currentStep - 1].fields;
    const isValid = await form.trigger(fields as any, { shouldFocus: true });

    if (isValid) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast({
        variant: 'destructive',
        title: 'Incomplete Information',
        description: 'Please fill out all the required fields in this step before proceeding.',
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };


  const handleCopySlots = (sourceDate: string, targetDates: Date[]) => {
    const slotsToCopy = form.getValues('slots').filter(slot => slot.date === sourceDate);
    if (slotsToCopy.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'No slots found for the selected source date.' });
      return;
    }

    const newSlots = targetDates.flatMap(targetDate => 
      slotsToCopy.map(slot => ({
        ...slot,
        id: uuidv4(),
        date: format(targetDate, 'yyyy-MM-dd'),
        bookedBy: null
      }))
    );
    
    appendSlot(newSlots);
    toast({ title: 'Success', description: `Copied ${slotsToCopy.length * targetDates.length} slots.` });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-colors",
                  currentStep > step.id ? "bg-primary text-primary-foreground" : 
                  currentStep === step.id ? "bg-primary/20 border-2 border-primary text-primary" : 
                  "bg-muted text-muted-foreground"
                )}>
                  {currentStep > step.id ? <Check /> : step.id}
                </div>
                <p className={cn(
                  "mt-2 text-sm text-center w-24",
                  currentStep === step.id ? "font-semibold text-primary" : "text-muted-foreground"
                )}>{step.name}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-1 mx-4 transition-colors",
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                )}/>
              )}
            </React.Fragment>
          ))}
        </div>

        {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in-50">
                <Tabs defaultValue="english" className="w-full">
                    <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="english">English Content</TabsTrigger><TabsTrigger value="tamil">Tamil Content</TabsTrigger></TabsList>
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
            </div>
        )}

        {currentStep === 2 && (
             <div className="space-y-8 animate-in fade-in-50">
                <Card>
                    <CardHeader><CardTitle>Custom Registration Form Builder</CardTitle><CardDescription>Create a multi-step form for users. Add steps, then add fields to each step.</CardDescription></CardHeader>
                    <CardContent className="space-y-6">
                        {registrationSteps.map((step, stepIndex) => (
                            <Card key={step.id} className="p-4 bg-muted/30">
                                <CardHeader className="flex flex-row items-center justify-between p-2">
                                    <div className="flex-1 space-y-2">
                                        <FormField name={`registrationForm.steps.${stepIndex}.name.en`} render={({ field }) => <FormItem><FormLabel>Step Name (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                        <FormField name={`registrationForm.steps.${stepIndex}.name.ta`} render={({ field }) => <FormItem><FormLabel>Step Name (TA)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                    </div>
                                    <div className="flex flex-col gap-1 ml-4">
                                        <Button type="button" variant="ghost" size="icon" disabled={stepIndex === 0} onClick={() => moveStep(stepIndex, stepIndex - 1)}><ArrowUp className="h-4 w-4" /></Button>
                                        <Button type="button" variant="ghost" size="icon" disabled={stepIndex === registrationSteps.length - 1} onClick={() => moveStep(stepIndex, stepIndex + 1)}><ArrowDown className="h-4 w-4" /></Button>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeStep(stepIndex)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-2">
                                    <StepFieldsEditor control={form.control} stepIndex={stepIndex} />
                                    <NavigationRulesEditor control={form.control} stepIndex={stepIndex} allSteps={allSteps} />
                                </CardContent>
                            </Card>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendStep({id: uuidv4(), name: { en: `Step ${registrationSteps.length + 1}`, ta: `படி ${registrationSteps.length + 1}`}, fields: []})}><PlusCircle className="mr-2 h-4 w-4" /> Add Form Step</Button>
                    </CardContent>
                </Card>
             </div>
        )}
        
        {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in-50">
                <Card>
                    <CardHeader>
                        <CardTitle>Available Time Slots</CardTitle>
                        <CardDescription>Select a date, then add the available time slots for that day.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 flex flex-col items-center">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                                modifiers={{ hasSlots: datesWithSlots }}
                                modifiersStyles={{
                                    hasSlots: { 
                                        border: '2px solid hsl(var(--primary))',
                                        borderRadius: 'var(--radius)'
                                    },
                                }}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex flex-wrap gap-2 justify-between items-center border-b pb-4">
                                <h3 className="font-medium">
                                    {selectedDate ? `Slots for ${format(selectedDate, 'PPP')}` : 'Select a date'}
                                </h3>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddSlot} disabled={!selectedDate}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add Slot
                                    </Button>
                                    <CopySlotsDialog slots={allSlots} onCopy={handleCopySlots} />
                                </div>
                            </div>
                            <div className="space-y-2 max-h-[24rem] overflow-y-auto p-1">
                                {slotFields.map((field, index) => {
                                    const fieldDate = form.watch(`slots.${index}.date`);
                                    if (fieldDate === formattedSelectedDate) {
                                        return (
                                            <div key={field.id} className="flex gap-2 items-center p-3 border rounded-lg bg-card shadow-sm animate-in fade-in-50">
                                                <FormField name={`slots.${index}.startTime`} render={({ field }) => <FormItem className="flex-1"><FormLabel className="text-xs">Start Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>} />
                                                <FormField name={`slots.${index}.endTime`} render={({ field }) => <FormItem className="flex-1"><FormLabel className="text-xs">End Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>} />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeSlot(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                                {allSlots.filter(s => s.date === formattedSelectedDate).length === 0 && (
                                    <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground py-10">
                                        {selectedDate ? "No slots for this date. Click 'Add Slot' to create one." : "Select a date from the calendar to manage slots."}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}

        {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in-50">
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
            </div>
        )}
        

        <div className="flex justify-between items-center pt-4">
          <div>
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
          </div>

          <div>
            {currentStep < steps.length && (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            )}

            {currentStep === steps.length && (
                <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
