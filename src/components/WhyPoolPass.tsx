import React from 'react';
import { CalendarCheck, ShieldCheck, Waves } from 'lucide-react';

const POINTS = [
  {
    icon: Waves,
    title: 'Quieter swims',
    body: 'Hotel and private pools with limited numbers, so you get lanes and loungers without the crowds.',
  },
  {
    icon: CalendarCheck,
    title: 'No membership',
    body: 'Pay for the day you want. Choose a full day, a morning or an afternoon, and add extras like towel hire.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety first',
    body: 'Every host agrees to our safety standards, from water testing to clear depth markings and first aid.',
  },
];

const WhyPoolPass = () => (
  <section className="bg-gray-50 section-padding">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Swim with PoolPass</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A simpler way to find a great pool for the day, wherever you are in the UK.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {POINTS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-pool-light inline-flex items-center justify-center w-12 h-12 rounded-full mb-4">
              <Icon className="h-6 w-6 text-pool-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyPoolPass;
