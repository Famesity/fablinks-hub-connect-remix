
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Button } from '@/components/ui/button';
import { Search, GraduationCap, Building2, FileText, Shield, Smartphone } from 'lucide-react';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const serviceCategories = [
    {
      id: 'education',
      title: '🎓 Education & Exams',
      icon: GraduationCap,
      color: 'bg-blue-500',
      services: [
        { name: 'WAEC Scratch Card', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20would%20like%20to%20buy%20a%20WAEC%20Scratch%20Card.' },
        { name: 'NECO Result Token', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20a%20NECO%20Result%20Token.' },
        { name: 'NABTEB Scratch Card', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20would%20like%20to%20buy%20a%20NABTEB%20Scratch%20Card.' },
        { name: 'NBAIS Scratch Card', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20an%20NBAIS%20Scratch%20Card.' },
        { name: 'WAEC Verification Pin (NYSC)', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20a%20WAEC%20Verification%20Pin%20for%20NYSC.' },
        { name: 'NECO e-Verify Token', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20a%20NECO%20e-Verify%20Token.' },
        { name: 'JAMB Original Result Printing', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20JAMB%20Original%20Result%20Printing.' },
        { name: 'JAMB Admission Letter Printing', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20JAMB%20Admission%20Letter%20Printing.' },
        { name: 'JAMB Reprinting', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20JAMB%20Reprinting.' },
        { name: 'Check JAMB Admission Status', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20please%20help%20me%20check%20my%20JAMB%20Admission%20Status.' },
        { name: 'JAMB O\'Level Upload', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20JAMB%20O%E2%80%99Level%20Result%20Upload.' },
        { name: 'JAMB Profile Code Retrieval', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20retrieving%20my%20JAMB%20Profile%20Code.' },
        { name: 'JAMB Registration Number Retrieval', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20retrieving%20my%20JAMB%20Registration%20Number.' }
      ]
    },
    {
      id: 'university',
      title: '🏫 University & Polytechnic Portals',
      icon: Building2,
      color: 'bg-green-500',
      services: [
        { name: 'Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Acceptance%20Fee%20Payment.' },
        { name: 'School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20School%20Fees%20Payment.' },
        { name: 'Hostel Accommodation', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Hostel%20Accommodation.' },
        { name: 'Results Checking', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20checking%20my%20University%20Results.' },
        { name: 'Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Course%20Registration.' }
      ]
    },
    {
      id: 'academic',
      title: '📄 Academic Support',
      icon: FileText,
      color: 'bg-purple-500',
      services: [
        { name: 'Project Writing', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Project%20Writing.' },
        { name: 'Assignments & Research', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Assignments%20and%20Research.' },
        { name: 'Seminars & Presentations', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Seminar%20or%20Presentation%20Preparation.' }
      ]
    },
    {
      id: 'nysc',
      title: '🪖 NYSC & Government',
      icon: Shield,
      color: 'bg-orange-500',
      services: [
        { name: 'NYSC Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20NYSC%20Registration.' },
        { name: 'NYSC Green Card Printing', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20NYSC%20Green%20Card%20Printing.' },
        { name: 'NYSC Call-Up Letter Printing', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20NYSC%20Call-Up%20Letter%20Printing.' },
        { name: 'NIN / NIMC Services', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20NIN/NIMC%20Services.' }
      ]
    },
    {
      id: 'utilities',
      title: '📱 Utilities & Bills',
      icon: Smartphone,
      color: 'bg-red-500',
      services: [
        { name: 'Airtime Top-Up', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20want%20to%20buy%20Airtime.' },
        { name: 'Data Subscription', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20want%20to%20subscribe%20for%20Data.' },
        { name: 'Internet Subscription', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20want%20to%20renew%20Internet%20Subscription.' },
        { name: 'Cable TV Subscription', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20want%20to%20pay%20for%20Cable%20TV%20Subscription.' },
        { name: 'Electricity Bill Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20want%20to%20pay%20my%20Electricity%20Bill.' },
        { name: 'Water Bill Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20want%20to%20pay%20my%20Water%20Bill.' }
      ]
    }
  ];

  const filteredCategories = serviceCategories.map(category => ({
    ...category,
    services: category.services.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.services.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-fablinks-blue-dark text-white py-16">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl mb-8">Complete digital solutions for Nigerian students and communities</p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Services Categories */}
        <section className="section-padding">
          <div className="container-custom">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="mb-16">
                  <div className="flex items-center mb-8">
                    <div className={`${category.color} p-3 rounded-lg mr-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold">{category.title}</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.services.map((service, index) => (
                      <div key={index} className="service-card">
                        <h3 className="text-lg font-semibold mb-4">{service.name}</h3>
                        <Button 
                          className="w-full btn-whatsapp justify-center"
                          onClick={() => window.open(service.link, '_blank')}
                        >
                          Get Started
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {filteredCategories.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">No services found matching your search.</p>
                <Button 
                  className="mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Services;
