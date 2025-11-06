
import React from 'react';
import { Shield, Clock, Users, Award, Heart, Zap } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const WhyChooseUs = () => {
  const { getSetting } = useSiteSettings();
  
  const featuresTitle = getSetting('features_title', 'Why Choose Us');
  const featuresSubtitle = getSetting('features_subtitle', 'We provide comprehensive educational services with professionalism and care');
  const features = [
    {
      icon: Shield,
      title: "100% Trusted",
      description: "Secure and reliable services with guaranteed results for all transactions"
    },
    {
      icon: Clock,
      title: "24/7 Support", 
      description: "Round-the-clock customer service to assist you whenever you need help"
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Lightning-fast processing for all services with immediate confirmation"
    },
    {
      icon: Users,
      title: "10,000+ Students Served",
      description: "Trusted by thousands of Nigerian students across all academic levels"
    },
    {
      icon: Award,
      title: "Expert Team",
      description: "Experienced professionals who understand Nigerian educational systems"
    },
    {
      icon: Heart,
      title: "Student-Focused",
      description: "Designed specifically for Nigerian students with affordable pricing"
    }
  ];

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
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="feature-card group">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-fablinks-blue-dark rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
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
        <div className="mt-16 bg-gradient-to-r from-primary to-fablinks-blue-dark rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">10,000+</div>
              <div className="text-sm opacity-90">Happy Students</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-sm opacity-90">Service Types</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-90">Support Available</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">99.9%</div>
              <div className="text-sm opacity-90">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
