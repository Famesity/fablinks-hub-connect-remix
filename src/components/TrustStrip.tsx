import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface TrustBadge {
  id: string;
  icon_name: string;
  title: string;
  display_order: number;
}

const TrustStrip = () => {
  const [badges, setBadges] = useState<TrustBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('trust_badges')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error fetching trust badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string): LucideIcon => {
    const icons = LucideIcons as unknown as Record<string, LucideIcon>;
    return icons[iconName] || LucideIcons.Star;
  };

  if (loading) {
    return (
      <section className="bg-primary/5 py-6 border-y border-primary/10">
        <div className="container-custom">
          <div className="flex justify-center gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
                <div className="w-20 h-4 bg-primary/20 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (badges.length === 0) return null;

  return (
    <section className="bg-primary/5 py-6 border-y border-primary/10">
      <div className="container-custom">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-12">
          {badges.map((badge) => {
            const IconComponent = getIcon(badge.icon_name);
            return (
              <div 
                key={badge.id} 
                className="flex items-center gap-2 md:gap-3 text-foreground/80 hover:text-primary transition-colors duration-300"
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <span className="font-medium text-sm md:text-base">{badge.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
