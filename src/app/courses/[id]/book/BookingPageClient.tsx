'use client';

import { useState, useMemo } from 'react';
import type { Course, FormField as FormFieldType } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { submitBookingAction } from '../actions';
import { format, parseISO, isValid } from 'date-fns';
import { Clock, Terminal, CheckCircle, Upload, ScanQrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

type BookingPageClientProps = {
  course: Course;
};

// A helper component to render the correct form field type
const renderFormField = (formField: FormFieldType, language: 'en' | 'ta', t: (translations: any) => string) => {
    const fieldName = `${formField.id}-${language}`;
    return (
        <FormField
            key={formField.id}
            name={fieldName as any}
            render={({ field }) => (
            <FormItem>
                <Label>{t(formField.label)}{formField.required && '*'}</Label>
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
    )
};


export default function BookingPageClient({ course }: BookingPageClientProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>(undefined);
  const [showPayment, setShowPayment] = useState(false);
  
  const { registrationForm } = course;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState<string | null>(null);

  const { slotsByDate, availableDays } = useMemo(() => {
    const slotsByDate: { [key: string]: typeof course.slots } = {};
    course.slots?.forEach(slot => {
      if (slot.date && isValid(parseISO(slot.date))) {
        const dateKey = format(parseISO(slot.date), 'yyyy-MM-dd');
        if (!slotsByDate[dateKey]) slotsByDate[dateKey] = [];
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

  const allFormFields = useMemo(() => registrationForm.steps.flatMap(step => step.fields), [registrationForm]);
  
  const dynamicSchema = useMemo(() => {
    return allFormFields.reduce((schema, field) => {
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
  }, [allFormFields, language, t]);

  const form = useForm<z.infer<typeof dynamicSchema>>({
    resolver: zodResolver(dynamicSchema),
    mode: 'onChange'
  });

  const isFinalStep = currentStepIndex === registrationForm.steps.length - 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            toast({
                variant: 'destructive',
                title: 'File Too Large',
                description: 'Please upload a screenshot under 2MB.',
            });
            e.target.value = ''; // Clear the input
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setPaymentScreenshotPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleNextStep = async () => {
    const currentStep = registrationForm.steps[currentStepIndex];
    const fieldNamesToValidate = currentStep.fields.map(f => `${f.id}-${language}`);
    const isValid = await form.trigger(fieldNamesToValidate as any);

    if (!isValid) {
      toast({ variant: 'destructive', title: 'Incomplete', description: 'Please fill all required fields.' });
      return;
    }

    if (isFinalStep) {
        setShowPayment(true);
        return;
    }
    
    let nextStepIndex = currentStepIndex + 1;
    
    // Check conditional navigation rules
    if (currentStep.navigationRules) {
        const formValues = form.getValues();
        for (const rule of currentStep.navigationRules) {
            const triggeringField = currentStep.fields.find(f => f.id === rule.fieldId);
            if (triggeringField) {
                const fieldValue = formValues[`${triggeringField.id}-${language}` as keyof typeof formValues];
                // Check against the English value for consistency
                if (fieldValue === rule.value) {
                    const targetStepIndex = registrationForm.steps.findIndex(s => s.id === rule.nextStepId);
                    if (targetStepIndex !== -1) {
                        nextStepIndex = targetStepIndex;
                        break; 
                    }
                }
            }
        }
    }

    if (nextStepIndex < registrationForm.steps.length) {
      setCurrentStepIndex(nextStepIndex);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  };


  const onFinalSubmit = form.handleSubmit(async (data) => {
    if (!selectedSlotId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a date and time slot first.' });
        return;
    }
    if (!transactionId.trim() || !paymentScreenshotPreview) {
        toast({ variant: 'destructive', title: 'Missing Payment Info', description: 'Please provide the transaction ID and upload a screenshot.' });
        return;
    }
    
    const result = await submitBookingAction(course.id, selectedSlotId, data, transactionId.trim(), paymentScreenshotPreview);
    if (result.success) {
        setIsSubmitted(true);
        form.reset();
        router.refresh();
    } else {
        toast({ variant: 'destructive', title: 'Booking Failed', description: result.error || 'An unexpected error occurred.' });
    }
  });

  if (showPayment) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center font-headline text-3xl font-bold text-primary">{t({ en: 'Complete Your Payment', ta: 'உங்கள் கட்டணத்தை முடிக்கவும்' })}</CardTitle>
                <CardDescription className="text-center">{t({ en: 'Scan to pay, then enter the transaction details below.', ta: 'பணம் செலுத்த ஸ்கேன் செய்து, பரிவர்த்தனை விவரங்களை கீழே உள்ளிடவும்.' })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex flex-col items-center gap-4 rounded-lg border p-4 bg-background">
                    <Image src="https://placehold.co/250x250.png" alt="GPay UPI QR Code" width={200} height={200} data-ai-hint="qr code"/>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground"><ScanQrCode className="h-4 w-4" /> {t({ en: 'Scan with any UPI app', ta: 'எந்த UPI செயலி மூலமும் ஸ்கேன் செய்யவும்' })}</p>
                </div>
                
                <div className="rounded-lg border p-4 space-y-2">
                    <h3 className="font-semibold text-lg">{t({ en: 'Payment Summary', ta: 'கட்டண சுருக்கம்' })}</h3>
                     <div className="flex justify-between font-bold text-lg text-primary">
                        <span>{t({ en: 'Amount to Pay', ta: 'செலுத்த வேண்டிய தொகை' })}</span>
                        <span>₹{course.price.discounted.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground text-sm">
                        <span>{t({ en: 'Original Price', ta: 'அசல் விலை' })}</span>
                        <span className="line-through">₹{course.price.original.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="transactionId">{t({ en: 'UPI Transaction ID', ta: 'UPI பரிவர்த்தனை ஐடி' })}*</Label>
                        <Input id="transactionId" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder={t({ en: 'Enter the 12-digit transaction ID', ta: '12 இலக்க பரிவர்த்தனை ஐடியை உள்ளிடவும்' })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paymentScreenshot">{t({ en: 'Upload Payment Screenshot', ta: 'பணம் செலுத்தியதற்கான ஸ்கிரீன்ஷாட்டைப் பதிவேற்றவும்' })}*</Label>
                        <Input id="paymentScreenshot" type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
                         <p className="text-sm text-muted-foreground">{t({ en: 'Max file size: 2MB', ta: 'அதிகபட்ச கோப்பு அளவு: 2MB' })}</p>
                    </div>
                    {paymentScreenshotPreview && (
                        <div>
                          <p className="text-sm font-medium mb-2">Screenshot Preview:</p>
                          <div className="relative w-full h-48 border rounded-md overflow-hidden bg-muted">
                              <Image src={paymentScreenshotPreview} alt="Screenshot preview" layout="fill" objectFit="contain" />
                          </div>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowPayment(false)} disabled={form.formState.isSubmitting}>
                    {t({ en: 'Back to Form', ta: 'படிவத்திற்குத் திரும்பு' })}
                </Button>
                <Button onClick={onFinalSubmit} disabled={form.formState.isSubmitting || !transactionId || !paymentScreenshotPreview}>
                    {form.formState.isSubmitting ? t({ en: 'Processing...', ta: 'செயலாக்குகிறது...' }) : (
                       <><Upload className="mr-2 h-4 w-4" />{t({ en: 'Confirm Booking', ta: 'முன்பதிவை உறுதிப்படுத்தவும்' })}</>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
  }

  if (isSubmitted) {
    return (
      <Card className="text-center p-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <CardTitle>{t({ en: "Booking Submitted!", ta: "முன்பதிவு சமர்ப்பிக்கப்பட்டது!" })}</CardTitle>
        <CardDescription className="mt-2">
            {t({ en: "Your slot will be confirmed after payment verification. We will contact you shortly.", ta: "பணம் செலுத்தியதைச் சரிபார்த்த பிறகு உங்கள் இடம் உறுதிசெய்யப்படும். நாங்கள் விரைவில் உங்களைத் தொடர்புகொள்வோம்."})}
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

  const currentStepData = registrationForm.steps[currentStepIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center font-headline text-3xl font-bold text-primary">{t({ en: 'Book Your Slot', ta: 'உங்கள் இடத்தை முன்பதிவு செய்யுங்கள்' })}</CardTitle>
        <CardDescription className="text-center">{t(course.title)}</CardDescription>
         <div className="pt-4 px-8">
            <Progress value={(currentStepIndex + 1) / registrationForm.steps.length * 100} />
            <p className="text-center text-sm text-muted-foreground mt-2">{t(currentStepData.name)} ({currentStepIndex + 1} / {registrationForm.steps.length})</p>
         </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="font-semibold mb-2 text-center">{t({ en: "1. Select a Date & Time", ta: "1. தேதி மற்றும் நேரத்தைத் தேர்ந்தெடுக்கவும்"})}</h3>
                <div className="flex flex-col items-center">
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
            </div>
            <div className="space-y-4">
                <h3 className="font-semibold text-center">{t({ en: "Available Time Slots", ta: "கிடைக்கும் நேரங்கள்"})}</h3>
                {selectedDate ? (
                slotsForSelectedDate.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
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
                    <p className="text-sm text-muted-foreground text-center">{t({ en: "No slots available for this date.", ta: "இந்தத் தேதிக்கு இடங்கள் எதுவும் இல்லை."})}</p>
                )
                ) : (
                <p className="text-sm text-muted-foreground text-center">{t({ en: "Please select a date to see available times.", ta: "கிடைக்கும் நேரங்களைப் பார்க்க ஒரு தேதியைத் தேர்ந்தெடுக்கவும்."})}</p>
                )}
            </div>
        </div>
        
        <div className={cn(!selectedSlotId && "opacity-50 pointer-events-none")}>
            <h3 className="font-semibold mb-4 text-center">{t({ en: "2. Your Details", ta: "2. உங்கள் விவரங்கள்"})}</h3>
            <FormProvider {...form}>
            <div className="space-y-4">
                 {currentStepData.fields.map((field) => renderFormField(field, language, t))}
                 
                 <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={handlePreviousStep} disabled={currentStepIndex === 0}>
                        {t({ en: 'Previous', ta: 'முந்தைய' })}
                    </Button>
                    
                    {isFinalStep ? (
                        <Button type="button" onClick={handleNextStep} disabled={!selectedSlotId}>
                           {t({ en: 'Proceed to Payment', ta: 'பணம் செலுத்த தொடரவும்' })}
                        </Button>
                    ) : (
                        <Button type="button" onClick={handleNextStep}>
                            {t({ en: 'Next', ta: 'அடுத்த' })}
                        </Button>
                    )}
                 </div>
            </div>
            </FormProvider>
        </div>
      </CardContent>
    </Card>
  );
}
