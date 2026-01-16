import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Loader2, Send, ClipboardList, MessageCircle, CheckCircle2 } from 'lucide-react';

const serviceRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  service_type: z.string().min(1, 'Please select a service type'),
  school_id: z.string().optional(),
  service_details: z.string().min(10, 'Please provide more details about your request').max(1000),
  urgency: z.string().optional(),
});

type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;

interface School {
  id: string;
  name: string;
}

const serviceTypes = [
  { value: 'education', label: 'Education & Exams (WAEC, JAMB, NECO)' },
  { value: 'university', label: 'University/Polytechnic Portal Services' },
  { value: 'academic', label: 'Academic Support (Projects, Assignments)' },
  { value: 'nysc', label: 'NYSC & Government Services' },
  { value: 'utilities', label: 'Utilities & Bills' },
  { value: 'printing', label: 'Printing & Document Services' },
  { value: 'digital', label: 'Digital Services' },
  { value: 'other', label: 'Other' },
];

const urgencyOptions = [
  { value: 'low', label: 'Low - Within a week' },
  { value: 'normal', label: 'Normal - Within 2-3 days' },
  { value: 'high', label: 'High - Within 24 hours' },
  { value: 'urgent', label: 'Urgent - ASAP' },
];

const Request = () => {
  const { toast } = useToast();
  const { getSetting } = useSiteSettings();
  const [schools, setSchools] = useState<School[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<ServiceRequestFormData | null>(null);

  const whatsappNumber = getSetting('whatsapp_number', '2348106411463');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      urgency: 'normal',
    },
  });

  const watchedServiceType = watch('service_type');
  const watchedSchoolId = watch('school_id');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const { data } = await supabase
        .from('schools')
        .select('id, name')
        .order('name');
      if (data) setSchools(data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const getServiceTypeLabel = (value: string) => {
    return serviceTypes.find(t => t.value === value)?.label || value;
  };

  const getUrgencyLabel = (value: string) => {
    return urgencyOptions.find(o => o.value === value)?.label || value;
  };

  const getSchoolName = (schoolId: string) => {
    return schools.find(s => s.id === schoolId)?.name || 'Not specified';
  };

  const generateWhatsAppMessage = (data: ServiceRequestFormData) => {
    const schoolName = data.school_id ? getSchoolName(data.school_id) : 'Not specified';
    
    return `🔔 *NEW SERVICE REQUEST*

👤 *Customer Details:*
• Name: ${data.name}
• Email: ${data.email}
• Phone: ${data.phone || 'Not provided'}

📋 *Request Details:*
• Service Type: ${getServiceTypeLabel(data.service_type)}
• School: ${schoolName}
• Urgency: ${getUrgencyLabel(data.urgency || 'normal')}

📝 *Description:*
${data.service_details}

---
Submitted via Fablinks Request Form`;
  };

  const openWhatsApp = (data: ServiceRequestFormData) => {
    const message = generateWhatsAppMessage(data);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const onSubmit = async (data: ServiceRequestFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('service_requests').insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        service_type: data.service_type,
        school_id: data.school_id || null,
        service_details: data.service_details,
        urgency: data.urgency || 'normal',
      });

      if (error) throw error;

      setSubmittedData(data);
      setIsSubmitted(true);

      toast({
        title: 'Request Submitted!',
        description: 'Your request has been saved. You can now contact us via WhatsApp for faster response.',
      });

    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewRequest = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
    reset();
  };

  if (isSubmitted && submittedData) {
    return (
      <Layout>
        <SEOHead
          title="Request Submitted - Fablinks Online Café"
          description="Your service request has been submitted successfully."
        />
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="border-2 border-green-500/20">
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-2xl text-green-600">Request Submitted Successfully!</CardTitle>
                <CardDescription className="text-base">
                  Your request has been saved to our system. For faster response, contact us on WhatsApp.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold">Request Summary:</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{submittedData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium">{getServiceTypeLabel(submittedData.service_type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Urgency:</span>
                      <span className="font-medium">{getUrgencyLabel(submittedData.urgency || 'normal')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={() => openWhatsApp(submittedData)}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Contact Us on WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleNewRequest}
                    className="w-full"
                  >
                    Submit Another Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="Request a Service - Fablinks Online Café"
        description="Can't find what you need? Submit a service request and we'll help you with any educational, document, or digital service."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Request a Service</h1>
            <p className="text-muted-foreground text-lg">
              Can't find what you need? Tell us what service you require and we'll get back to you.
            </p>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Service Request Form</CardTitle>
              <CardDescription>
                Fill out the form below and we'll contact you via WhatsApp or phone to assist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+234 706 812 2861"
                      {...register('phone')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Service Type *</Label>
                    <Select onValueChange={(value) => setValue('service_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service_type && (
                      <p className="text-sm text-destructive">{errors.service_type.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Your School (Optional)</Label>
                    <Select onValueChange={(value) => setValue('school_id', value === 'none' ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your school" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not Applicable</SelectItem>
                        {schools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Urgency Level</Label>
                    <Select 
                      defaultValue="normal"
                      onValueChange={(value) => setValue('urgency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_details">Service Details *</Label>
                  <Textarea
                    id="service_details"
                    placeholder="Please describe what service you need in detail. Include any specific requirements, deadlines, or relevant information..."
                    rows={5}
                    {...register('service_details')}
                  />
                  {errors.service_details && (
                    <p className="text-sm text-destructive">{errors.service_details.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Request
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  After submitting, you'll be able to contact us directly on WhatsApp for faster response.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Request;
