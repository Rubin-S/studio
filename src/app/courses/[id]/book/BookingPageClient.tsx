'use client';

import { useState, useMemo } from 'react';
import type { Course } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { submitBookingAction } from '../actions';
import { format, parseISO } from 'date-fns';
import { Clock, Terminal, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type BookingPageClientProps = {
  course: Course;
};

export default function BookingPageClient({ course }: BookingPageClientProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>(undefined);

  // Memoize slots processing for performance
  const { slotsByDate, availableDays } = useMemo(() => {
    const slotsByDate: { [key: string]: typeof course.slots } = {};
    course.slots.forEach(slot => {
      if (slot.date) {
        const dateKey = format(parseISO(slot.date), 'yyyy-MM-dd');
        if (!slotsByDate[dateKey]) {
          slotsByDate[dateKey] = [];
        }
        slotsByDate[dateKey].push(slot);
      }
    });

    const availableDays = Object.keys(slotsByDate)
      .filter(dateKey => slotsByDate[dateKey].some(slot => !slot.bookedBy))
      .map(dateKey => parseISO(dateKey));
      
    return { slotsByDate, availableDays };
  }, [course.slots]);

  const selectedDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const slotsForSelectedDate = slotsByDate[selectedDateKey] || [];

  // Dynamic Zod schema for the form
  const dynamicSchema = course.formFields.reduce((schema, field) => {
    const fieldName = `${field.id}-${language}`;
    let zodType;
    switch (field.type) {
      case 'email': zodType = z.string().email({ message: "Invalid email address." }); break;
      case 'tel': zodType = z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number."}); break;
      default: zodType = z.string();
    }
    if (field.required) {
      zodType = zodType.min(1, { message: `${t(field.label)} is required.` });
    } else {
      zodType = zodType.optional();
    }
    return schema.extend({ [fieldName]: zodType });
  }, z.object({}));

  const form = useForm<z.infer<typeof dynamicSchema>>({
    resolver: zodResolver(dynamicSchema),
  });

  const onSubmit = async (data: z.infer<typeof dynamicSchema>) => {
    if (!selectedSlotId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a time slot first.' });
        return;
    }
    const result = await submitBookingAction(course.id, selectedSlotId, data);
    if (result.success) {
        setIsSubmitted(true);
        form.reset();
        router.refresh();
    } else {
        toast({ variant: 'destructive', title: 'Booking Failed', description: result.error || 'An unexpected error occurred.' });
    }
  };

  if (isSubmitted) {
    return (
      <Card className="text-center p-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <CardTitle>{t({ en: "Booking Confirmed!", ta: "முன்பதிவு உறுதியானது!" })}</CardTitle>
        <CardDescription className="mt-2">
            {t({ en: "Your slot is reserved. We've received your details and will contact you shortly.", ta: "உங்கள் இடம் ஒதுக்கப்பட்டுள்ளது. உங்கள் விவரங்களைப் பெற்றுள்ளோம், விரைவில் உங்களைத் தொடர்புகொள்வோம்."})}
        </CardDescription>
        <Button onClick={() => router.push('/courses')} className="mt-6">
            {t({ en: "Back to Courses", ta: "படிப்புகளுக்குத் திரும்பு" })}
        </Button>
      </Card>
    );
  }

  if (availableDays.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>{t(course.title)}</CardTitle></CardHeader>
        <CardContent>
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>{t({en: "No Slots Available", ta: "இடங்கள் எதுவும் இல்லை"})}</AlertTitle>
                <AlertDescription>{t({en: "All slots for this course are currently booked. Please check back later.", ta: "இந்தப் பாடத்திற்கான அனைத்து இடங்களும் தற்போது முன்பதிவு செய்யப்பட்டுவிட்டன. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ."})}</AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center font-headline text-3xl font-bold text-primary">{t({ en: 'Book Your Slot', ta: 'உங்கள் இடத்தை முன்பதிவு செய்யுங்கள்' })}</CardTitle>
        <CardDescription className="text-center">{t(course.title)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-2">{t({ en: "1. Select a Date", ta: "1. ஒரு தேதியைத் தேர்ந்தெடுக்கவும்"})}</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1)) || !availableDays.some(d => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))}
              modifiers={{ available: availableDays }}
              modifiersStyles={{ available: { border: "2px solid hsl(var(--primary))" } }}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">{t({ en: "2. Select a Time Slot", ta: "2. ஒரு நேரத்தைத் தேர்ந்தெடுக்கவும்"})}</h3>
            {selectedDate ? (
              slotsForSelectedDate.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {slotsForSelectedDate.map(slot => (
                    <Button
                      key={slot.id}
                      variant={selectedSlotId === slot.id ? 'default' : 'outline'}
                      disabled={!!slot.bookedBy}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={cn("flex flex-col h-auto p-3", slot.bookedBy && "cursor-not-allowed opacity-50 bg-muted text-muted-foreground")}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{slot.startTime} - {slot.endTime}</span>
                      </div>
                      {slot.bookedBy && <span className="text-xs mt-1">Booked</span>}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t({ en: "No slots available for this date.", ta: "இந்தத் தேதிக்கு இடங்கள் எதுவும் இல்லை."})}</p>
              )
            ) : (
              <p className="text-sm text-muted-foreground">{t({ en: "Please select a date to see available times.", ta: "கிடைக்கும் நேரங்களைப் பார்க்க ஒரு தேதியைத் தேர்ந்தெடுக்கவும்."})}</p>
            )}
          </div>
        </div>
        
        <div className={cn(!selectedSlotId && "opacity-50 pointer-events-none")}>
            <h3 className="font-semibold mb-4">{t({ en: "3. Your Details", ta: "3. உங்கள் விவரங்கள்"})}</h3>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 {course.formFields.map((formField) => (
                    <FormField
                        key={formField.id}
                        control={form.control}
                        name={`${formField.id}-${language}` as any}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t(formField.label)}{formField.required && '*'}</FormLabel>
                            <FormControl>
                            {formField.type === 'textarea' ? ( <Textarea placeholder={t(formField.placeholder)} {...field} />
                            ) : formField.type === 'select' ? (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder={t(formField.placeholder) || t({ en: 'Select an option', ta: 'ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்' })} /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {formField.options?.map((option, i) => (<SelectItem key={i} value={t(option)}>{t(option)}</SelectItem>))}
                                </SelectContent>
                                </Select>
                            ) : ( <Input type={formField.type} placeholder={t(formField.placeholder)} {...field} /> )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                ))}
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !selectedSlotId}>
                    {form.formState.isSubmitting ? t({ en: 'Submitting...', ta: 'சமர்ப்பிக்கப்படுகிறது...' }) : t({ en: 'Book Now', ta: 'இப்போதே முன்பதிவு செய்யவும்' })}
                </Button>
            </form>
            </Form>
        </div>
      </CardContent>
    </Card>
  );
}
