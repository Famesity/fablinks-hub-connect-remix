import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, ClipboardList } from 'lucide-react';

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

const ServiceRequestForm = () => {
  const { toast } = useToast();
  const [schools, setSchools] = useState<School[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      urgency: 'normal',
    },
  });

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

      toast({
        title: 'Request Submitted!',
        description: 'We will contact you shortly to assist with your service request.',
      });

      reset();
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

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Request a Service</CardTitle>
            <CardDescription>Fill out the form and we'll get back to you</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                placeholder="+234..."
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
              <Select onValueChange={(value) => setValue('school_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent>
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
              rows={4}
              {...register('service_details')}
            />
            {errors.service_details && (
              <p className="text-sm text-destructive">{errors.service_details.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceRequestForm;