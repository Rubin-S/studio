'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Course } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { submitBookingAction } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useState } from 'react';

interface CourseBookingFormProps {
  course: Course;
}

export default function CourseBookingForm({ course }: CourseBookingFormProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dynamically build Zod schema from formFields
  const dynamicSchema = course.formFields.reduce((schema, field) => {
    const fieldName = `${field.id}-${language}`;
    let zodType;

    switch (field.type) {
      case 'email':
        zodType = z.string().email({ message: "Invalid email address." });
        break;
      case 'tel':
        zodType = z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number."});
        break;
      default:
        zodType = z.string();
    }
    
    if (field.required) {
        zodType = zodType.min(1, { message: `${t(field.label)} is required.` });
    } else {
        zodType = zodType.optional();
    }

    return schema.extend({ [fieldName]: zodType });
  }, z.object({
    slotId: z.string({ required_error: 'Please select a time slot.'})
  }));

  const form = useForm<z.infer<typeof dynamicSchema>>({
    resolver: zodResolver(dynamicSchema),
  });

  const onSubmit = async (data: z.infer<typeof dynamicSchema>) => {
    const { slotId, ...formData } = data;
    const result = await submitBookingAction(course.id, slotId, formData);

    if (result.success) {
        setIsSubmitted(true);
        toast({ title: 'Booking Successful!', description: 'Your slot has been reserved. We will contact you shortly.' });
        form.reset();
        router.refresh(); // Refresh to update available slots
    } else {
        toast({ variant: 'destructive', title: 'Booking Failed', description: result.error || 'An unexpected error occurred.' });
    }
  };

  const availableSlots = course.slots.filter(slot => !slot.bookedBy && slot.dateTime);

  if (isSubmitted) {
    return (
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>{t({en: "Thank You!", ta: "நன்றி!"})}</AlertTitle>
            <AlertDescription>
                {t({en: "Your booking is confirmed. We've received your details and will be in touch shortly to follow up.", ta: "உங்கள் முன்பதிவு உறுதியானது. உங்கள் விவரங்களைப் பெற்றுள்ளோம், விரைவில் உங்களைத் தொடர்புகொள்வோம்."})}
            </AlertDescription>
        </Alert>
    )
  }

  if (availableSlots.length === 0) {
    return (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>{t({en: "No Slots Available", ta: "இடங்கள் எதுவும் இல்லை"})}</AlertTitle>
            <AlertDescription>
                {t({en: "All slots for this course are currently booked. Please check back later.", ta: "இந்தப் பாடத்திற்கான அனைத்து இடங்களும் தற்போது முன்பதிவு செய்யப்பட்டுவிட்டன. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ."})}
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="slotId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-semibold">{t({en: "1. Select a Time Slot", ta: "1. நேரத்தைத் தேர்ந்தெடுக்கவும்"})}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {availableSlots.map((slot) => (
                    <FormItem key={slot.id} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={slot.id} />
                      </FormControl>
                      <FormLabel className="font-normal border rounded-md p-3 w-full cursor-pointer hover:bg-accent hover:text-accent-foreground has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground">
                        {format(new Date(slot.dateTime), 'PPpp')}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {course.formFields.length > 0 && (
            <div>
                <FormLabel className="text-lg font-semibold">{t({en: "2. Your Details", ta: "2. உங்கள் விவரங்கள்"})}</FormLabel>
                <div className="space-y-4 mt-4">
                    {course.formFields.map((formField) => {
                        const fieldName = `${formField.id}-${language}`;
                        return (
                        <FormField
                            key={formField.id}
                            control={form.control}
                            name={fieldName as any}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t(formField.label)}{formField.required && '*'}</FormLabel>

                                <FormControl>
                                    {formField.type === 'textarea' ? (
                                        <Textarea placeholder={t(formField.placeholder)} {...field} />
                                    ) : (
                                        <Input type={formField.type} placeholder={t(formField.placeholder)} {...field} />
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        );
                    })}
                </div>
            </div>
        )}
        
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t({en: 'Submitting...', ta: 'சமர்ப்பிக்கப்படுகிறது...'}) : t({en: 'Book Now', ta: 'இப்போதே முன்பதிவு செய்யவும்'})}
        </Button>
      </form>
    </Form>
  );
}
