
import React from 'react';
import Layout from '@/components/Layout';
import { CheckCircle, Target, Heart, Users } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: CheckCircle,
      title: 'Trust',
      description: 'We build lasting relationships through reliable and honest service delivery.'
    },
    {
      icon: Target,
      title: 'Speed',
      description: 'Quick turnaround times to meet your urgent academic and digital needs.'
    },
    {
      icon: Heart,
      title: 'Affordability',
      description: 'Quality services at student-friendly prices that won\'t break the bank.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Supporting Nigerian students and communities in their digital journey.'
    }
  ];

  return (
    <Layout>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-fablinks-blue-dark text-white py-16">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Fablinks Online Café</h1>
            <p className="text-xl">Your trusted digital gateway to academic success</p>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Fablinks Online Café was born from a simple observation: Nigerian students and communities 
                  needed a reliable, affordable, and fast digital service provider. We recognized the challenges 
                  students face in accessing essential academic services, from WAEC scratch cards to JAMB registration, 
                  and decided to bridge that gap.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    "Helping Nigerian students and communities succeed digitally by providing accessible, 
                    reliable, and affordable digital services that remove barriers to academic and personal growth."
                  </p>
                </div>
                <div className="bg-fablinks-gray-light p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To become Nigeria's most trusted digital service provider, empowering every student 
                    and community member with the tools they need to achieve their goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-fablinks-gray-light">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600">The principles that guide everything we do</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-primary p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
              <p className="text-lg text-gray-600">Numbers that speak to our commitment</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <p className="text-lg font-medium">Students Served</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-lg font-medium">Services Offered</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-lg font-medium">Support Available</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default About;
