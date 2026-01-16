import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

const serviceRequestSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  phone: z.string().trim().min(10, 'Phone number must be at least 10 digits').max(20).optional().or(z.literal('')),
  service_type: z.string().min(1, 'Please select a service type'),
  school_id: z.string().optional(),
  service_details: z.string().trim().max(1000).optional(),
  urgency: z.string().optional(),
});

type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;

interface School {
  id: string;
  name: string;
}

const serviceTypes = [
  'WAEC Scratch Card',
  'NECO Result Token',
  'JAMB Services',
  'School Fees Payment',
  'Course Registration',
  'NYSC Registration',
  'NIN/NIMC Services',
  'Document Printing',
  'Academic Project',
  'Other Service'
];

const urgencyLevels = [
  { value: 'low', label: 'Low - Within a week' },
  { value: 'medium', label: 'Medium - Within 2-3 days' },
  { value: 'high', label: 'High - Within 24 hours' },
  { value: 'urgent', label: 'Urgent - Immediately' },
];

interface ServiceRequestFormProps {
  onSuccess?: () => void;
}

const ServiceRequestForm = ({ onSuccess }: ServiceRequestFormProps) => {
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);

  const form = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service_type: '',
      school_id: '',
      service_details: '',
      urgency: 'medium',
    },
  });

  useEffect(() => {
    const fetchSchools = async () => {
      const { data } = await supabase
        .from('schools')
        .select('id, name')
        .order('name');
      if (data) setSchools(data);
    };
    fetchSchools();
  }, []);

  const onSubmit = async (data: ServiceRequestFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('service_requests').insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        service_type: data.service_type,
        school_id: data.school_id || null,
        service_details: data.service_details || null,
        urgency: data.urgency || 'medium',
        status: 'pending',
      });

      if (error) throw error;

      toast.success('Service request submitted successfully! We will contact you shortly.');
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+234 XXX XXX XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background">
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="school_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School (if applicable)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background max-h-60">
                    <SelectItem value="">Not applicable</SelectItem>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urgency Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background">
                    {urgencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="service_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Details</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please provide any additional details about your request..."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ServiceRequestForm;
