import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Step {
  id: string;
  step_number: number;
  title: string;
  description: string | null;
  icon_name: string | null;
}

const HowItWorks = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    try {
      const { data, error } = await supabase
        .from('how_it_works_steps')
        .select('*')
        .eq('is_active', true)
        .order('step_number', { ascending: true });

      if (error) throw error;
      setSteps(data || []);
    } catch (error) {
      console.error('Error fetching how it works steps:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string | null): LucideIcon => {
    if (!iconName) return LucideIcons.Circle;
    const icons = LucideIcons as unknown as Record<string, LucideIcon>;
    return icons[iconName] || LucideIcons.Circle;
  };

  if (loading) {
    return (
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="h-10 bg-muted rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-muted rounded w-96 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse text-center">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (steps.length === 0) return null;

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting help from Fablinks is simple and straightforward
          </p>
        </div>

        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -translate-y-1/2 z-0" style={{ top: '60px' }}></div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = getIcon(step.icon_name);
              return (
                <div 
                  key={step.id} 
                  className="text-center group"
                >
                  {/* Step Number & Icon */}
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-primary/20 group-hover:border-primary transition-all duration-300 mx-auto">
                      <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                      {step.step_number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-semibold mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  {step.description && (
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
