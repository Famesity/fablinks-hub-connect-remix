import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, GraduationCap, Building2, FileText, Shield, Smartphone, Filter, School, Printer, CreditCard, Globe, FileImage, Camera } from 'lucide-react';

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
        { name: 'JAMB Registration Number Retrieval', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20retrieving%20my%20JAMB%20Registration%20Number.' },
        { name: 'WAEC GCE Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20WAEC%20GCE%20Registration.' },
        { name: 'NECO Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20NECO%20Registration.' }
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
        { name: 'Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Course%20Registration.' },
        { name: 'Transcript Application', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Transcript%20Application.' },
        { name: 'Post-UTME Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Post-UTME%20Registration.' },
        { name: 'Student ID Card Services', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Student%20ID%20Card%20Services.' },
        { name: 'Medical Form Submission', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Medical%20Form%20Submission.' }
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
        { name: 'Seminars & Presentations', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Seminar%20or%20Presentation%20Preparation.' },
        { name: 'Thesis/Dissertation Support', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Thesis/Dissertation%20writing.' },
        { name: 'CV/Resume Writing', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20CV/Resume%20writing.' },
        { name: 'Business Plan Writing', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Business%20Plan%20writing.' }
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
        { name: 'NIN / NIMC Services', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20NIN/NIMC%20Services.' },
        { name: 'Police Character Certificate', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Police%20Character%20Certificate.' },
        { name: 'International Passport Application', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20International%20Passport%20Application.' },
        { name: 'Drivers License Application', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Drivers%20License%20Application.' },
        { name: 'Voters Card Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Voters%20Card%20Registration.' }
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
        { name: 'Water Bill Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20want%20to%20pay%20my%20Water%20Bill.' },
        { name: 'Betting & Gaming Top-up', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20want%20to%20fund%20my%20betting%20account.' }
      ]
    },
    {
      id: 'printing',
      title: '🖨️ Printing & Document Services',
      icon: Printer,
      color: 'bg-teal-500',
      services: [
        { name: 'Document Printing', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20document%20printing%20services.' },
        { name: 'Passport Photograph', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20passport%20photograph%20services.' },
        { name: 'Lamination Services', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20lamination%20services.' },
        { name: 'Photocopy Services', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20photocopy%20services.' },
        { name: 'Binding Services', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20document%20binding%20services.' },
        { name: 'Scanning Services', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20document%20scanning%20services.' },
        { name: 'Large Format Printing', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20large%20format%20printing%20services.' }
      ]
    },
    {
      id: 'digital',
      title: '💻 Digital Services',
      icon: Globe,
      color: 'bg-indigo-500',
      services: [
        { name: 'Computer Training', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20computer%20training%20services.' },
        { name: 'Email Setup', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20email%20setup.' },
        { name: 'Online Application Assistance', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20online%20applications.' },
        { name: 'Digital Marketing Services', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20digital%20marketing%20services.' },
        { name: 'Website Development', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20website%20development%20services.' },
        { name: 'Social Media Management', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20social%20media%20management%20services.' }
      ]
    }
  ];

  const nigerianSchools = [
    {
      name: 'University of Lagos (UNILAG)',
      services: [
        { name: 'UNILAG School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILAG%20School%20Fees%20Payment.' },
        { name: 'UNILAG Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILAG%20Course%20Registration.' },
        { name: 'UNILAG Hostel Booking', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILAG%20Hostel%20Booking.' },
        { name: 'UNILAG Results Checking', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20checking%20my%20UNILAG%20Results.' },
        { name: 'UNILAG Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILAG%20Acceptance%20Fee%20Payment.' },
        { name: 'UNILAG Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILAG%20Faculty%20Dues%20Payment.' },
        { name: 'UNILAG GST Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILAG%20GST%20Fees%20Payment.' }
      ]
    },
    {
      name: 'University of Ibadan (UI)',
      services: [
        { name: 'UI School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UI%20School%20Fees%20Payment.' },
        { name: 'UI Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UI%20Course%20Registration.' },
        { name: 'UI Results Checking', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20checking%20my%20UI%20Results.' },
        { name: 'UI Post-UTME Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UI%20Post-UTME%20Registration.' },
        { name: 'UI Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UI%20Acceptance%20Fee%20Payment.' },
        { name: 'UI Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UI%20Hostel%20Fee%20Payment.' },
        { name: 'UI Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UI%20Faculty%20Dues%20Payment.' }
      ]
    },
    {
      name: 'Obafemi Awolowo University (OAU)',
      services: [
        { name: 'OAU School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20OAU%20School%20Fees%20Payment.' },
        { name: 'OAU Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20OAU%20Course%20Registration.' },
        { name: 'OAU Hostel Application', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20OAU%20Hostel%20Application.' },
        { name: 'OAU Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20OAU%20Acceptance%20Fee%20Payment.' },
        { name: 'OAU Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20OAU%20Faculty%20Dues%20Payment.' },
        { name: 'OAU GST Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20OAU%20GST%20Fees%20Payment.' }
      ]
    },
    {
      name: 'University of Nigeria Nsukka (UNN)',
      services: [
        { name: 'UNN School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNN%20School%20Fees%20Payment.' },
        { name: 'UNN Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNN%20Course%20Registration.' },
        { name: 'UNN Results Portal', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNN%20Results%20Portal.' },
        { name: 'UNN Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNN%20Acceptance%20Fee%20Payment.' },
        { name: 'UNN Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNN%20Hostel%20Fee%20Payment.' },
        { name: 'UNN Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNN%20Faculty%20Dues%20Payment.' }
      ]
    },
    {
      name: 'Ahmadu Bello University (ABU)',
      services: [
        { name: 'ABU School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABU%20School%20Fees%20Payment.' },
        { name: 'ABU Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABU%20Course%20Registration.' },
        { name: 'ABU Admission Portal', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABU%20Admission%20Portal.' },
        { name: 'ABU Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABU%20Acceptance%20Fee%20Payment.' },
        { name: 'ABU Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABU%20Hostel%20Fee%20Payment.' },
        { name: 'ABU GST Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABU%20GST%20Fees%20Payment.' }
      ]
    },
    {
      name: 'University of Benin (UNIBEN)',
      services: [
        { name: 'UNIBEN School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIBEN%20School%20Fees%20Payment.' },
        { name: 'UNIBEN Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIBEN%20Course%20Registration.' },
        { name: 'UNIBEN Student Portal', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIBEN%20Student%20Portal.' },
        { name: 'UNIBEN Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIBEN%20Acceptance%20Fee%20Payment.' },
        { name: 'UNIBEN Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIBEN%20Hostel%20Fee%20Payment.' },
        { name: 'UNIBEN Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIBEN%20Faculty%20Dues%20Payment.' }
      ]
    },
    {
      name: 'Abia State University (ABSU)',
      services: [
        { name: 'ABSU School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABSU%20School%20Fees%20Payment.' },
        { name: 'ABSU Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABSU%20Course%20Registration.' },
        { name: 'ABSU Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABSU%20Acceptance%20Fee%20Payment.' },
        { name: 'ABSU Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABSU%20Hostel%20Fee%20Payment.' },
        { name: 'ABSU Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABSU%20Faculty%20Dues%20Payment.' },
        { name: 'ABSU GST Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ABSU%20GST%20Fees%20Payment.' },
        { name: 'ABSU Results Checking', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20checking%20my%20ABSU%20Results.' }
      ]
    },
    {
      name: 'Imo State University (IMSU)',
      services: [
        { name: 'IMSU School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20IMSU%20School%20Fees%20Payment.' },
        { name: 'IMSU Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20IMSU%20Course%20Registration.' },
        { name: 'IMSU Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20IMSU%20Acceptance%20Fee%20Payment.' },
        { name: 'IMSU Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20IMSU%20Hostel%20Fee%20Payment.' },
        { name: 'IMSU Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20IMSU%20Faculty%20Dues%20Payment.' },
        { name: 'IMSU GST Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20IMSU%20GST%20Fees%20Payment.' },
        { name: 'IMSU Results Checking', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20checking%20my%20IMSU%20Results.' }
      ]
    },
    {
      name: 'Lagos State University (LASU)',
      services: [
        { name: 'LASU School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20LASU%20School%20Fees%20Payment.' },
        { name: 'LASU Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20LASU%20Course%20Registration.' },
        { name: 'LASU E-Learning Portal', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20LASU%20E-Learning%20Portal.' },
        { name: 'LASU Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20LASU%20Acceptance%20Fee%20Payment.' },
        { name: 'LASU Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20LASU%20Hostel%20Fee%20Payment.' },
        { name: 'LASU Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20LASU%20Faculty%20Dues%20Payment.' }
      ]
    },
    {
      name: 'University of Port Harcourt (UNIPORT)',
      services: [
        { name: 'UNIPORT School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIPORT%20School%20Fees%20Payment.' },
        { name: 'UNIPORT Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIPORT%20Course%20Registration.' },
        { name: 'UNIPORT Student Portal', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIPORT%20Student%20Portal.' },
        { name: 'UNIPORT Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIPORT%20Acceptance%20Fee%20Payment.' },
        { name: 'UNIPORT Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIPORT%20Hostel%20Fee%20Payment.' },
        { name: 'UNIPORT GST Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIPORT%20GST%20Fees%20Payment.' }
      ]
    },
    {
      name: 'Delta State University (DELSU)',
      services: [
        { name: 'DELSU School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20DELSU%20School%20Fees%20Payment.' },
        { name: 'DELSU Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20DELSU%20Course%20Registration.' },
        { name: 'DELSU Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20DELSU%20Acceptance%20Fee%20Payment.' },
        { name: 'DELSU Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20DELSU%20Hostel%20Fee%20Payment.' },
        { name: 'DELSU Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20DELSU%20Faculty%20Dues%20Payment.' },
        { name: 'DELSU GST Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20DELSU%20GST%20Fees%20Payment.' }
      ]
    },
    {
      name: 'Rivers State University (RSU)',
      services: [
        { name: 'RSU School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20RSU%20School%20Fees%20Payment.' },
        { name: 'RSU Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20RSU%20Course%20Registration.' },
        { name: 'RSU Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20RSU%20Acceptance%20Fee%20Payment.' },
        { name: 'RSU Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20RSU%20Hostel%20Fee%20Payment.' },
        { name: 'RSU Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20RSU%20Faculty%20Dues%20Payment.' },
        { name: 'RSU GST Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20RSU%20GST%20Fees%20Payment.' }
      ]
    },
    {
      name: 'Covenant University',
      services: [
        { name: 'Covenant University Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Covenant%20University%20Payment.' },
        { name: 'Covenant University Portal', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Covenant%20University%20Portal.' },
        { name: 'Covenant Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Covenant%20University%20Course%20Registration.' },
        { name: 'Covenant Acceptance Fee', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Covenant%20University%20Acceptance%20Fee.' },
        { name: 'Covenant Hostel Fee', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Covenant%20University%20Hostel%20Fee.' }
      ]
    },
    {
      name: 'Babcock University',
      services: [
        { name: 'Babcock University Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Babcock%20University%20Payment.' },
        { name: 'Babcock University Portal', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Babcock%20University%20Portal.' },
        { name: 'Babcock Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Babcock%20University%20Course%20Registration.' },
        { name: 'Babcock Acceptance Fee', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Babcock%20University%20Acceptance%20Fee.' },
        { name: 'Babcock Hostel Fee', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Babcock%20University%20Hostel%20Fee.' }
      ]
    },
    {
      name: 'Federal University of Technology Akure (FUTA)',
      services: [
        { name: 'FUTA School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FUTA%20School%20Fees%20Payment.' },
        { name: 'FUTA Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FUTA%20Course%20Registration.' },
        { name: 'FUTA Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FUTA%20Acceptance%20Fee%20Payment.' },
        { name: 'FUTA Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FUTA%20Hostel%20Fee%20Payment.' },
        { name: 'FUTA Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FUTA%20Faculty%20Dues%20Payment.' }
      ]
    },
    {
      name: 'University of Ilorin (UNILORIN)',
      services: [
        { name: 'UNILORIN School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILORIN%20School%20Fees%20Payment.' },
        { name: 'UNILORIN Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILORIN%20Course%20Registration.' },
        { name: 'UNILORIN Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILORIN%20Acceptance%20Fee%20Payment.' },
        { name: 'UNILORIN Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILORIN%20Hostel%20Fee%20Payment.' },
        { name: 'UNILORIN GST Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNILORIN%20GST%20Fees%20Payment.' }
      ]
    },
    {
      name: 'Nnamdi Azikiwe University (UNIZIK)',
      services: [
        { name: 'UNIZIK School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIZIK%20School%20Fees%20Payment.' },
        { name: 'UNIZIK Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIZIK%20Course%20Registration.' },
        { name: 'UNIZIK Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIZIK%20Acceptance%20Fee%20Payment.' },
        { name: 'UNIZIK Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIZIK%20Hostel%20Fee%20Payment.' },
        { name: 'UNIZIK Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20UNIZIK%20Faculty%20Dues%20Payment.' }
      ]
    },
    {
      name: 'Bayero University Kano (BUK)',
      services: [
        { name: 'BUK School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20BUK%20School%20Fees%20Payment.' },
        { name: 'BUK Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20BUK%20Course%20Registration.' },
        { name: 'BUK Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20BUK%20Acceptance%20Fee%20Payment.' },
        { name: 'BUK Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20BUK%20Hostel%20Fee%20Payment.' },
        { name: 'BUK GST Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20BUK%20GST%20Fees%20Payment.' }
      ]
    },
    {
      name: 'Enugu State University of Science and Technology (ESUT)',
      services: [
        { name: 'ESUT School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ESUT%20School%20Fees%20Payment.' },
        { name: 'ESUT Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ESUT%20Course%20Registration.' },
        { name: 'ESUT Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ESUT%20Acceptance%20Fee%20Payment.' },
        { name: 'ESUT Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ESUT%20Hostel%20Fee%20Payment.' },
        { name: 'ESUT Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ESUT%20Faculty%20Dues%20Payment.' },
        { name: 'ESUT GST Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20ESUT%20GST%20Fees%20Payment.' }
      ]
    },
    {
      name: 'Cross River University of Technology (CRUTECH)',
      services: [
        { name: 'CRUTECH School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20CRUTECH%20School%20Fees%20Payment.' },
        { name: 'CRUTECH Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20CRUTECH%20Course%20Registration.' },
        { name: 'CRUTECH Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20CRUTECH%20Acceptance%20Fee%20Payment.' },
        { name: 'CRUTECH Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20CRUTECH%20Hostel%20Fee%20Payment.' },
        { name: 'CRUTECH Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20CRUTECH%20Faculty%20Dues%20Payment.' }
      ]
    },
    {
      name: 'Akwa Ibom State University (AKSU)',
      services: [
        { name: 'AKSU School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20AKSU%20School%20Fees%20Payment.' },
        { name: 'AKSU Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20AKSU%20Course%20Registration.' },
        { name: 'AKSU Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20AKSU%20Acceptance%20Fee%20Payment.' },
        { name: 'AKSU Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20AKSU%20Hostel%20Fee%20Payment.' },
        { name: 'AKSU Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20AKSU%20Faculty%20Dues%20Payment.' },
        { name: 'AKSU GST Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20AKSU%20GST%20Fees%20Payment.' }
      ]
    },
    {
      name: 'Ebonyi State University (EBSU)',
      services: [
        { name: 'EBSU School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20EBSU%20School%20Fees%20Payment.' },
        { name: 'EBSU Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20EBSU%20Course%20Registration.' },
        { name: 'EBSU Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20EBSU%20Acceptance%20Fee%20Payment.' },
        { name: 'EBSU Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20EBSU%20Hostel%20Fee%20Payment.' },
        { name: 'EBSU Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20EBSU%20Faculty%20Dues%20Payment.' },
        { name: 'EBSU GST Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20EBSU%20GST%20Fees%20Payment.' }
      ]
    },
    {
      name: 'Federal Polytechnic Nekede',
      services: [
        { name: 'FPNO School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Federal%20Polytechnic%20Nekede%20School%20Fees%20Payment.' },
        { name: 'FPNO Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Federal%20Polytechnic%20Nekede%20Course%20Registration.' },
        { name: 'FPNO Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Federal%20Polytechnic%20Nekede%20Acceptance%20Fee.' },
        { name: 'FPNO Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Federal%20Polytechnic%20Nekede%20Hostel%20Fee.' }
      ]
    },
    {
      name: 'Yaba College of Technology (YABATECH)',
      services: [
        { name: 'YABATECH School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20YABATECH%20School%20Fees%20Payment.' },
        { name: 'YABATECH Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20YABATECH%20Course%20Registration.' },
        { name: 'YABATECH Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20YABATECH%20Acceptance%20Fee%20Payment.' },
        { name: 'YABATECH Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20YABATECH%20Hostel%20Fee%20Payment.' }
      ]
    },
    {
      name: 'Lagos State Polytechnic (LASPOTECH)',
      services: [
        { name: 'LASPOTECH School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20LASPOTECH%20School%20Fees%20Payment.' },
        { name: 'LASPOTECH Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20LASPOTECH%20Course%20Registration.' },
        { name: 'LASPOTECH Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20LASPOTECH%20Acceptance%20Fee%20Payment.' },
        { name: 'LASPOTECH Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20LASPOTECH%20Hostel%20Fee%20Payment.' }
      ]
    },
    {
      name: 'Federal College of Education Akoka',
      services: [
        { name: 'FCE Akoka School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FCE%20Akoka%20School%20Fees%20Payment.' },
        { name: 'FCE Akoka Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FCE%20Akoka%20Course%20Registration.' },
        { name: 'FCE Akoka Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FCE%20Akoka%20Acceptance%20Fee%20Payment.' },
        { name: 'FCE Akoka Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FCE%20Akoka%20Hostel%20Fee%20Payment.' }
      ]
    },
    {
      name: 'Michael Okpara University of Agriculture (MOUAU)',
      services: [
        { name: 'MOUAU School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20MOUAU%20School%20Fees%20Payment.' },
        { name: 'MOUAU Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20MOUAU%20Course%20Registration.' },
        { name: 'MOUAU Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20MOUAU%20Acceptance%20Fee%20Payment.' },
        { name: 'MOUAU Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20MOUAU%20Hostel%20Fee%20Payment.' },
        { name: 'MOUAU Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20MOUAU%20Faculty%20Dues%20Payment.' }
      ]
    },
    {
      name: 'Federal University of Agriculture Abeokuta (FUNAAB)',
      services: [
        { name: 'FUNAAB School Fees Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FUNAAB%20School%20Fees%20Payment.' },
        { name: 'FUNAAB Course Registration', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FUNAAB%20Course%20Registration.' },
        { name: 'FUNAAB Acceptance Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FUNAAB%20Acceptance%20Fee%20Payment.' },
        { name: 'FUNAAB Hostel Fee Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FUNAAB%20Hostel%20Fee%20Payment.' },
        { name: 'FUNAAB Faculty Dues Payment', link: 'https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20FUNAAB%20Faculty%20Dues%20Payment.' }
      ]
    }
  ];

  const categoryButtons = [
    { id: 'all', label: 'All Services', icon: null },
    { id: 'education', label: 'Education & Exams', icon: GraduationCap },
    { id: 'university', label: 'University Portals', icon: Building2 },
    { id: 'academic', label: 'Academic Support', icon: FileText },
    { id: 'nysc', label: 'NYSC & Government', icon: Shield },
    { id: 'utilities', label: 'Utilities & Bills', icon: Smartphone },
    { id: 'printing', label: 'Printing & Documents', icon: Printer },
    { id: 'digital', label: 'Digital Services', icon: Globe }
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
    <Layout>
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
    </Layout>
  );
};

export default Services;
