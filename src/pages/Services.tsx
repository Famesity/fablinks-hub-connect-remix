
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, GraduationCap, Building2, FileText, Shield, Smartphone, Filter, School } from 'lucide-react';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('general');

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

  const nigerianSchools = [
    {
      name: 'University of Lagos (UNILAG)',
      services: [
        { name: 'UNILAG School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILAG%20School%20Fees%20Payment.' },
        { name: 'UNILAG Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILAG%20Course%20Registration.' },
        { name: 'UNILAG Hostel Booking', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILAG%20Hostel%20Booking.' }
      ]
    },
    {
      name: 'University of Ibadan (UI)',
      services: [
        { name: 'UI School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UI%20School%20Fees%20Payment.' },
        { name: 'UI Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UI%20Course%20Registration.' },
        { name: 'UI Results Checking', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20checking%20my%20UI%20Results.' }
      ]
    },
    {
      name: 'Obafemi Awolowo University (OAU)',
      services: [
        { name: 'OAU School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20OAU%20School%20Fees%20Payment.' },
        { name: 'OAU Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20OAU%20Course%20Registration.' }
      ]
    },
    {
      name: 'University of Nigeria Nsukka (UNN)',
      services: [
        { name: 'UNN School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNN%20School%20Fees%20Payment.' },
        { name: 'UNN Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNN%20Course%20Registration.' }
      ]
    },
    {
      name: 'Ahmadu Bello University (ABU)',
      services: [
        { name: 'ABU School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABU%20School%20Fees%20Payment.' },
        { name: 'ABU Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABU%20Course%20Registration.' }
      ]
    },
    {
      name: 'University of Benin (UNIBEN)',
      services: [
        { name: 'UNIBEN School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIBEN%20School%20Fees%20Payment.' },
        { name: 'UNIBEN Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIBEN%20Course%20Registration.' }
      ]
    }
  ];

  const categoryButtons = [
    { id: 'all', label: 'All Services', icon: null },
    { id: 'education', label: 'Education & Exams', icon: GraduationCap },
    { id: 'university', label: 'University Portals', icon: Building2 },
    { id: 'academic', label: 'Academic Support', icon: FileText },
    { id: 'nysc', label: 'NYSC & Government', icon: Shield },
    { id: 'utilities', label: 'Utilities & Bills', icon: Smartphone }
  ];

  const getFilteredCategories = () => {
    let filtered = serviceCategories;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(category => category.id === selectedCategory);
    }
    
    return filtered.map(category => ({
      ...category,
      services: category.services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.services.length > 0);
  };

  const getSchoolServices = () => {
    const school = nigerianSchools.find(s => s.name.toLowerCase().includes(selectedSchool.toLowerCase()));
    return school ? school.services : [];
  };

  const filteredCategories = getFilteredCategories();
  const schoolServices = getSchoolServices();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-fablinks-blue-dark text-white py-16">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl mb-8">Complete digital solutions for Nigerian students and communities</p>
            
            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto space-y-4">
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
              
              {/* Category Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-2">
                {categoryButtons.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "secondary" : "outline"}
                      className={`${selectedCategory === category.id 
                        ? 'bg-white text-primary' 
                        : 'bg-white/20 border-white/30 text-white hover:bg-white hover:text-primary'
                      } text-sm`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                      {category.label}
                    </Button>
                  );
                })}
              </div>
              
              {/* School Selection */}
              <div className="max-w-md mx-auto">
                <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                  <SelectTrigger className="bg-white text-gray-900">
                    <School className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select your school for specific services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Services</SelectItem>
                    {nigerianSchools.map((school, index) => (
                      <SelectItem key={index} value={school.name.toLowerCase()}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* School-Specific Services */}
        {selectedSchool !== 'general' && schoolServices.length > 0 && (
          <section className="section-padding bg-blue-50">
            <div className="container-custom">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <School className="w-6 h-6 mr-2 text-primary" />
                {nigerianSchools.find(s => s.name.toLowerCase().includes(selectedSchool.toLowerCase()))?.name} Services
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {schoolServices.map((service, index) => (
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
          </section>
        )}

        {/* School Not Found Section */}
        {selectedSchool !== 'general' && schoolServices.length === 0 && (
          <section className="section-padding bg-yellow-50">
            <div className="container-custom text-center">
              <h2 className="text-2xl font-bold mb-4">School Not Found?</h2>
              <p className="text-lg text-gray-600 mb-6">
                Don't worry! We support services for all Nigerian universities and polytechnics.
              </p>
              <Button 
                className="btn-whatsapp"
                onClick={() => window.open('https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20my%20school%20portal%20services.%20My%20school%20is%20not%20listed.', '_blank')}
              >
                Chat with us for your school
              </Button>
            </div>
          </section>
        )}

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
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear Filters
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
