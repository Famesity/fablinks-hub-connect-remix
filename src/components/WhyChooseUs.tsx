import React, { useState, useEffect } from 'react';
import { Shield, Clock, Users, Award, Heart, Zap, Circle, Star, CheckCircle, Target, Lightbulb, Rocket, TrendingUp, ThumbsUp } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Feature {
  id: string;
  icon_name: string;
  title: string;
  description: string;
  display_order: number;
}

interface Statistic {
  id: string;
  label: string;
  value: string;
  display_order: number;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Shield, Clock, Users, Award, Heart, Zap, Circle, Star, CheckCircle, Target, Lightbulb, Rocket, TrendingUp, ThumbsUp
};

const WhyChooseUs = () => {
  const { getSetting } = useSiteSettings();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);
  
  const featuresTitle = getSetting('features_title', 'Why Choose Us');
  const featuresSubtitle = getSetting('features_subtitle', 'We provide comprehensive educational services with professionalism and care');

  const defaultFeatures = [
    { id: '1', icon_name: 'Shield', title: "100% Trusted", description: "Secure and reliable services with guaranteed results for all transactions", display_order: 1 },
    { id: '2', icon_name: 'Clock', title: "24/7 Support", description: "Round-the-clock customer service to assist you whenever you need help", display_order: 2 },
    { id: '3', icon_name: 'Zap', title: "Instant Delivery", description: "Lightning-fast processing for all services with immediate confirmation", display_order: 3 },
    { id: '4', icon_name: 'Users', title: "10,000+ Students Served", description: "Trusted by thousands of Nigerian students across all academic levels", display_order: 4 },
    { id: '5', icon_name: 'Award', title: "Expert Team", description: "Experienced professionals who understand Nigerian educational systems", display_order: 5 },
    { id: '6', icon_name: 'Heart', title: "Student-Focused", description: "Designed specifically for Nigerian students with affordable pricing", display_order: 6 }
  ];

  const defaultStatistics = [
    { id: '1', label: 'Happy Students', value: '10,000+', display_order: 1 },
    { id: '2', label: 'Service Types', value: '50+', display_order: 2 },
    { id: '3', label: 'Support Available', value: '24/7', display_order: 3 },
    { id: '4', label: 'Success Rate', value: '99.9%', display_order: 4 }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featuresResponse, statsResponse] = await Promise.all([
        supabase.from('why_choose_us_features').select('*').eq('is_active', true).order('display_order'),
        supabase.from('site_statistics').select('*').eq('is_active', true).order('display_order')
      ]);

      if (featuresResponse.data && featuresResponse.data.length > 0) {
        setFeatures(featuresResponse.data);
      } else {
        setFeatures(defaultFeatures);
      }

      if (statsResponse.data && statsResponse.data.length > 0) {
        setStatistics(statsResponse.data);
      } else {
        setStatistics(defaultStatistics);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
      setFeatures(defaultFeatures);
      setStatistics(defaultStatistics);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Circle;
  };

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {featuresTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {featuresSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = getIcon(feature.icon_name);
            return (
              <div key={feature.id} className="feature-card group">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-defabs-blue-dark rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Statistics */}
        <div className="mt-16 bg-gradient-to-r from-primary to-defabs-blue-dark rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {statistics.map((stat) => (
              <div key={stat.id}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
