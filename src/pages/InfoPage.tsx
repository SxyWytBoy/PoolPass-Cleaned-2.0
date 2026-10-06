import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NotFound from '@/pages/NotFound';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/lib/supabase';

type Section = { heading: string; body: string[] };

interface PageContent {
  title: string;
  intro: string;
  sections?: Section[];
  faqs?: { q: string; a: string }[];
  cta?: { label: string; to: string };
  contactForm?: boolean;
}

const PAGES: Record<string, PageContent> = {
  about: {
    title: 'About PoolPass',
    intro: 'PoolPass lets you book a swim at private and hotel pools across the UK, by the day, without a membership.',
    sections: [
      {
        heading: 'Why we started',
        body: [
          'Thousands of pools sit empty for most of the week, while public pools are crowded and often closed for lessons. PoolPass connects people who want a quiet swim with owners who are happy to share their pool.',
          'Hosts set their own prices, opening hours and house rules. Guests get a calm swim, often with a sauna, hot tub or garden thrown in.',
        ],
      },
      {
        heading: 'How we keep it safe',
        body: [
          'Every host agrees to our safety standards, including water testing, clear depth markings and accessible first aid. Read more on our safety page.',
        ],
      },
    ],
    cta: { label: 'Find a pool', to: '/pools' },
  },
  careers: {
    title: 'Careers',
    intro: 'We are a small team getting PoolPass ready for launch.',
    sections: [
      {
        heading: 'Open roles',
        body: [
          'We have no open roles at the moment. If you would like to help build PoolPass, introduce yourself through the contact form and tell us what you would bring.',
        ],
      },
    ],
    cta: { label: 'Get in touch', to: '/contact' },
  },
  press: {
    title: 'Press',
    intro: 'Writing about private pool hire or the UK swimming scene? We are happy to help.',
    sections: [
      {
        heading: 'Press enquiries',
        body: [
          'Send us your questions, deadline and publication through the contact form and we will reply within two working days.',
          'You are welcome to use the PoolPass name and logo when writing about us.',
        ],
      },
    ],
    cta: { label: 'Contact us', to: '/contact' },
  },
  blog: {
    title: 'The PoolPass Blog',
    intro: 'Tips for better swims and better hosting.',
    sections: [
      {
        heading: 'What to pack for a pool day',
        body: [
          'Bring two towels (one for the poolside, one for after your shower), flip-flops, goggles and a refillable water bottle. Many hosts offer towel hire if you would rather travel light.',
        ],
      },
      {
        heading: 'Indoor or outdoor: choosing the right pool',
        body: [
          'Outdoor pools are at their best from May to September. Most PoolPass outdoor pools are heated to 27-30°C, but an indoor pool is the safer choice for a winter swim or a rainy day.',
        ],
      },
      {
        heading: 'Hosting tip: great photos get more bookings',
        body: [
          'Shoot in daylight with the water still, include the changing area, and choose a cover photo that shows the whole pool. Listings with five photos are booked far more often than listings with one.',
        ],
      },
    ],
  },
  'gift-cards': {
    title: 'Gift Cards',
    intro: 'Give someone a day at a pool.',
    sections: [
      {
        heading: 'Coming at launch',
        body: [
          'PoolPass gift cards will be available when we launch. Join the waitlist and we will let you know as soon as you can buy one.',
        ],
      },
    ],
    cta: { label: 'Join the waitlist', to: '/waitlist' },
  },
  help: {
    title: 'Help Centre',
    intro: 'Answers to the questions we hear most often.',
    faqs: [
      { q: 'How do I book a pool?', a: 'Find a pool, pick a date and an access option, choose how many guests are coming and any extras, then select Request Booking. The host confirms your booking, and you can follow it in your dashboard.' },
      { q: 'When am I charged?', a: "You aren't charged until the host confirms your booking." },
      { q: 'Can I cancel?', a: 'Yes. Open your dashboard and choose Cancel booking on any upcoming booking. The host is told straight away.' },
      { q: 'How is the price worked out?', a: 'Pools are priced per person, per day. Half-day options cost 60% of the day price. Extras such as towel hire are added on top.' },
      { q: 'How do I list my pool?', a: 'Apply on the Become a Host page, or create a host account and set up your listing from the host dashboard. Your listing stays a draft until you publish it.' },
      { q: 'Can I leave a review?', a: 'Yes. Once you have booked a pool, a review form appears on its page.' },
    ],
    cta: { label: 'Still stuck? Contact us', to: '/contact' },
  },
  contact: {
    title: 'Contact Us',
    intro: 'Questions, feedback or press enquiries. We read every message and reply within two working days.',
    contactForm: true,
  },
  terms: {
    title: 'Terms & Conditions',
    intro: 'The short version: be kind, follow the house rules and look after each other.',
    sections: [
      { heading: 'Bookings', body: ['A booking is an agreement between the guest and the host. PoolPass provides the platform that connects you and handles booking requests.'] },
      { heading: 'Guests', body: ['Follow the host\'s house rules and the safety guidance on each listing. Children must be supervised by an adult at all times. Arrive and leave within your booked access times.'] },
      { heading: 'Hosts', body: ['Keep your listing accurate, your pool clean and safe, and reply to booking requests promptly. You are responsible for any permissions, insurance and safety obligations that apply to your pool.'] },
      { heading: 'Cancellations', body: ['Guests can cancel upcoming bookings from their dashboard. Hosts can decline requests they cannot accommodate.'] },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'We collect only what we need to run PoolPass, and we never sell your data.',
    sections: [
      { heading: 'What we collect', body: ['Your name, email address and account type when you sign up; your bookings and reviews; and the details of any listing or application you submit.'] },
      { heading: 'How we use it', body: ['To run your account, process bookings, show your first name next to reviews, and contact you about your bookings. Waitlist emails are used only to tell you when PoolPass launches.'] },
      { heading: 'Your choices', body: ['You can update your profile from your dashboard, or ask us to delete your account and data through the contact form.'] },
    ],
  },
  'host-resources': {
    title: 'Host Resources',
    intro: 'Everything you need to run a successful listing.',
    sections: [
      { heading: 'Setting your price', body: ['Look at similar pools nearby and start a little below them until you have reviews. You can change your price any time from the host dashboard.'] },
      { heading: 'Opening hours', body: ['Set the hours and days you are happy to host. If your hours run past 1pm, guests can also book morning or afternoon access.'] },
      { heading: 'Extras', body: ['Towel hire, robes, drinks and sauna sessions are easy wins. Add them from the details tab of your listing.'] },
    ],
    cta: { label: 'Go to the host dashboard', to: '/host-dashboard' },
  },
  'host-forum': {
    title: 'Host Community',
    intro: 'A place for PoolPass hosts to swap tips.',
    sections: [
      { heading: 'Opening soon', body: ['The host forum opens at launch. In the meantime, our Host Resources page covers pricing, opening hours and extras.'] },
    ],
    cta: { label: 'Read Host Resources', to: '/host-resources' },
  },
  'responsible-hosting': {
    title: 'Responsible Hosting',
    intro: 'Good hosting keeps guests safe and neighbours happy.',
    sections: [
      { heading: 'Safety', body: ['Test and log your water chemistry, mark depths clearly, keep a first aid kit and rescue aid by the pool, and display your house rules.'] },
      { heading: 'Neighbours', body: ['Agree sensible hours, ask guests to keep noise down and make parking arrangements clear in your listing.'] },
      { heading: 'Permissions and insurance', body: ['Check whether your home insurance, mortgage, lease or local authority rules require permission or extra cover before you host paying guests.'] },
    ],
    cta: { label: 'Read our safety standards', to: '/safety' },
  },
};

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email) || message.trim().length < 10) {
      setError('Add your name, a valid email address and a message of at least 10 characters.');
      return;
    }
    setSending(true);
    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert({ name: name.trim(), email: email.trim(), subject: subject.trim() || null, message: message.trim() });
    setSending(false);
    if (insertError) {
      setError('Your message could not be sent. Please try again.');
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Message sent</h2>
        <p className="text-gray-600">Thanks {name.split(' ')[0]}. We'll reply to {email} within two working days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-subject">Subject (optional)</Label>
        <Input id="contact-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={sending} className="w-full bg-pool-primary hover:bg-pool-secondary">
        {sending ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  );
};

const InfoPage = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  const page = PAGES[slug];

  if (!page) return <NotFound />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-r from-pool-dark to-pool-primary mt-20 md:mt-24 py-14 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{page.title}</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl">{page.intro}</p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-3xl space-y-10">
        {page.sections?.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-semibold mb-3">{section.heading}</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}

        {page.faqs && (
          <Accordion type="single" collapsible className="bg-white rounded-xl shadow-sm px-6">
            {page.faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {page.contactForm && <ContactForm />}

        {page.cta && (
          <Link to={page.cta.to}>
            <Button className="bg-pool-primary hover:bg-pool-secondary">{page.cta.label}</Button>
          </Link>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default InfoPage;
