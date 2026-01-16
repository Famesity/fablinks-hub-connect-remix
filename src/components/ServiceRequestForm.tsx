import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

const serviceRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  school_id: z.string().optional(),
  service_type: z.string().min(1, 'Please select a service type'),
  service_details: z.string().min(10, 'Please provide more details about your request').max(1000),
  urgency: z.string().default('normal'),
});

type ServiceRequestData = z.infer<typeof serviceRequestSchema>;

interface School {
  id: string;
  name: string;
  abbreviation: string | null;
}

const ServiceRequestForm = () => {
  const { toast } = useToast();
  const [schools, setSchools] = useState<School[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceRequestData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      urgency: 'normal',
    },
  });

  useEffect(() => {
    const fetchSchools = async () => {
      const { data } = await supabase
        .from('schools')
        .select('id, name, abbreviation')
        .order('name');
      if (data) setSchools(data);
    };
    fetchSchools();
  }, []);

  const serviceTypes = [
    'JAMB Registration',
    'WAEC Registration',
    'NECO Registration',
    'Post-UTME Registration',
    'Course Registration',
    'School Fees Payment',
    'Hostel Fees Payment',
    'NYSC Registration',
    'Transcript Request',
    'Project/Assignment Help',
    'NIN/NIMC Registration',
    'Printing Services',
    'Graphics Design',
    'Other',
  ];

  const onSubmit = async (data: ServiceRequestData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('service_requests').insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        school_id: data.school_id || null,
        service_type: data.service_type,
        service_details: data.service_details,
        urgency: data.urgency,
      });

      if (error) throw error;

      toast({
        title: 'Request Submitted!',
        description: 'We will contact you shortly regarding your service request.',
      });
      reset();
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="Enter your phone number"
            {...register('phone')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="school">Your School/Institution</Label>
          <Select onValueChange={(value) => setValue('school_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your school (optional)" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.abbreviation ? `${school.abbreviation} - ${school.name}` : school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="service_type">Service Type *</Label>
          <Select onValueChange={(value) => setValue('service_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              {serviceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.service_type && (
            <p className="text-sm text-destructive">{errors.service_type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="urgency">Urgency Level</Label>
          <Select onValueChange={(value) => setValue('urgency', value)} defaultValue="normal">
            <SelectTrigger>
              <SelectValue placeholder="Select urgency" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="low">Low - Within a week</SelectItem>
              <SelectItem value="normal">Normal - Within 2-3 days</SelectItem>
              <SelectItem value="high">High - Within 24 hours</SelectItem>
              <SelectItem value="urgent">Urgent - ASAP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service_details">Service Details *</Label>
        <Textarea
          id="service_details"
          placeholder="Please describe your request in detail. Include any specific requirements, deadlines, or additional information..."
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
  );
};

export default ServiceRequestForm;
